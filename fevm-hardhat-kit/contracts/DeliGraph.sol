// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import {SwitchToken} from "./SwitchToken.sol";
import {IFriendsGraph} from "./interfaces/IFriendsGraph.sol";
import {IReferralIntro} from "./interfaces/IReferralIntro.sol";

contract DeliGraph is SwitchToken, IFriendsGraph, IReferralIntro {
    error ConnectionStakeIsTooSmall();
    error UnfriendWithdrwalFailed();
    error NoFriendConnection();
    error ReferrerIsNotConnectedToAllParties();
    error IntroCoverFeeIsTooLow();
    error NoIntroWithSuchReferrer();
    error NoIntroWithSuchResource();

    struct Intro {
        address referrer;
        address resource;
        uint256 introPayment;
        uint256 proposedStake;
        bool paid;
        bool accepted;
    }

    struct Connection {
        uint256 amount;
        bool connected;
    }

    // profiles: address => resume CID
    mapping(address => bytes) profiles;
    // friends graph with staking
    mapping(address => mapping(address => Connection)) private graph;
    // Cost for introduction
    mapping(address => uint256) listenerCosts;
    // referred introduction for a fee and slashing mechanics: initiator => Intro
    mapping(address => Intro) introductions;
    // someone has to create a profile without referrals
    bool firstProfileCreated;
    // Config to check if you can create profile by invites only
    bool referralsEnabled;
    // Config percentage that referrer gets for intro
    uint256 referrerPercentage = 1000; // 10%

    event FreindRequested(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event FriendApproved(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event Unfriended(address indexed from, address indexed to, uint256 amount);
    event ProfileCreated(
        address indexed creator,
        address indexed referrer,
        bytes indexed profileCid
    );

    constructor() SwitchToken() {}

    // function erc20TokenID(address tokenAddress) public view returns (uint256) {
    //     return uint256(uint160(tokenAddress));
    // }

    function createProfile(bytes calldata profileCid, address referrer)
        external
        payable
    {
        if (firstProfileCreated && referralsEnabled) {
            // Someone must have staked behind your connection first
            Connection memory referrerConnection = graph[referrer][msg.sender];
            if (!referrerConnection.connected) revert NoIntroWithSuchReferrer();
            if (msg.value < referrerConnection.amount)
                revert ConnectionStakeIsTooSmall();

            // Create the same stake for the bi-directional connection
            graph[msg.sender][referrer] = Connection(
                referrerConnection.amount,
                true
            );
        } else {
            firstProfileCreated = true;
        }
        // Create profile
        profiles[msg.sender] = profileCid;
        addCidToMarket(profileCid);

        emit ProfileCreated(msg.sender, referrer, profileCid);
    }

    // IFriendsGraph

    function myConnectionStrength(address child)
        external
        view
        returns (uint256)
    {
        return graph[msg.sender][child].amount;
    }

    function connectionStrength(address a, address b)
        external
        view
        returns (uint256)
    {
        return graph[a][b].amount;
    }

    // stake amount on the connection with to
    function requestFriend(address to, uint256 amount) external payable {
        // require(
        //     IERC20(tokenAddress).transferFrom(
        //         msg.sender,
        //         address(this),
        //         amount
        //     ),
        //     "can't transfer"
        // );

        if (msg.value < amount) revert ConnectionStakeIsTooSmall();
        // Store staked native token (FIL) on connection from sender to a friend
        graph[msg.sender][to] = Connection(amount, true);

        emit FreindRequested(msg.sender, to, amount);
    }

    // stake amount on the connection with from (2-sided connection now)
    function approveFriend(address from) external payable {
        // require(
        //     IERC20(tokenAddress).transferFrom(
        //         msg.sender,
        //         address(this),
        //         amount
        //     ),
        //     "can't transfer"
        // );

        Connection memory friendConnection = graph[from][msg.sender];
        if (!friendConnection.connected) revert NoFriendConnection();
        if (msg.value < friendConnection.amount)
            revert ConnectionStakeIsTooSmall();

        graph[msg.sender][from] = Connection(friendConnection.amount, true);

        _mint(msg.sender, friendConnection.amount);
        _mint(from, friendConnection.amount);

        emit FriendApproved(from, msg.sender, friendConnection.amount);
    }

    function unfriend(address from) external {
        Connection memory myConnection = graph[msg.sender][from];
        Connection memory friendConnection = graph[from][msg.sender];
        if (!myConnection.connected) revert NoFriendConnection();
        if (!friendConnection.connected) revert NoFriendConnection();

        // Must be equal at all times, otherwise it's a logic error
        assert(myConnection.amount == friendConnection.amount);

        graph[msg.sender][from] = Connection(0, false);
        graph[from][msg.sender] = Connection(0, false);
        _burn(msg.sender, myConnection.amount);
        _burn(from, friendConnection.amount);
        // require(
        //     IERC20(tokenAddress).transferFrom(address(this), a, abAmount),
        //     "can't transfer"
        // );
        // require(
        //     IERC20(tokenAddress).transferFrom(address(this), b, baAmount),
        //     "can't transfer"
        // );
        (bool res, ) = msg.sender.call{value: myConnection.amount}("");
        if (!res) revert UnfriendWithdrwalFailed();
        (res, ) = from.call{value: friendConnection.amount}("");
        if (!res) revert UnfriendWithdrwalFailed();

        emit Unfriended(msg.sender, from, myConnection.amount);
    }

    // IReferralIntro
    function listenCost(address listener) external view returns (uint256) {
        return listenerCosts[listener];
    }

    function listenCostSet(uint256 amount) external {
        listenerCosts[msg.sender] = amount;
    }

    function introduceInitiator(address initiator, address to) external {
        // msg.sender is referrer
        if (
            !graph[msg.sender][initiator].connected ||
            !graph[initiator][msg.sender].connected ||
            !graph[msg.sender][to].connected ||
            !graph[to][msg.sender].connected
        ) {
            revert ReferrerIsNotConnectedToAllParties();
        }

        // Calculate initator payment costs
        uint256 resourceListenCost = listenerCosts[to];
        uint256 referrerAbsoluteFee = (resourceListenCost *
            referrerPercentage) / 10000; // 10000 = 100 %

        // save intro data including amount for intro
        introductions[initiator] = Intro(
            msg.sender,
            to,
            resourceListenCost + referrerAbsoluteFee,
            0,
            false,
            false
        );
    }

    function coverIntroFee(address referrer, address to) external payable {
        Intro storage intro = introductions[msg.sender];
        if (msg.value < intro.introPayment) {
            revert IntroCoverFeeIsTooLow();
        }
        if (intro.referrer != referrer) revert NoIntroWithSuchReferrer();
        if (intro.resource != to) revert NoIntroWithSuchResource();
        introductions[msg.sender].paid = true;
        // 10% of the stake of referrer and to must be locked
    }

    function acceptIntro(
        address initiator,
        address referrer,
        uint256 proposedStake
    ) external payable {
        Intro storage intro = introductions[initiator];
        if (intro.referrer != referrer) revert NoIntroWithSuchReferrer();
        if (intro.resource != msg.sender) revert NoIntroWithSuchResource();
        introductions[msg.sender].accepted = true;

        // create a new connection in graph
        if (msg.value < proposedStake) revert ConnectionStakeIsTooSmall();
        graph[msg.sender][initiator] = Connection(proposedStake, true);
    }
}
