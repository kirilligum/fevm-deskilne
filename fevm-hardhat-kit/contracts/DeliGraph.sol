// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {SwitchToken} from "./DeliToken.sol";
import {IFriendsGraph} from "./interfaces/IFriendsGraph.sol";
import {IReferralIntro} from "./interfaces/IReferralIntro.sol";

contract DeliGraph is SwitchToken, IFriendsGraph, IReferralIntro {
    error ConnectionStakeIsTooSmall();
    error UnfriendWithdrwalFailed();

    struct Intro {
        address referrer;
        address resource;
        uint256 introPayment;
        uint256 proposedStake;
        bool paid;
        bool accepted;
    }

    // profiles: address => resume CID
    mapping(address => bytes) profiles;
    // friends graph with staking
    mapping(address => mapping(address => uint256)) private graph;
    // Cost for introduction
    mapping(address => uint256) listenerCosts;
    // referred introduction for a fee and slashing mechanics
    mapping(address => Intro) introductions;
    // someone has to create a profile without referrals
    bool firstProfileCreated;

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

    function createProfile(bytes calldata cid, address referrer)
        external
        payable
    {
        if (firstProfileCreated) {
            // Someone must have staked behind your connection first
            uint256 referrerStake = graph[referrer][msg.sender];
            if (msg.value < referrerStake) revert ConnectionStakeIsTooSmall();

            // Create the same stake for the bi-directional connection
            graph[msg.sender][referrer] = referrerStake;
        } else {
            firstProfileCreated = true;
        }
        // Create profile
        profiles[msg.sender] = cid;

        emit ProfileCreated(msg.sender, referrer, cid);
    }

    // IFriendsGraph

    function myConnectionStrength(address child)
        external
        view
        returns (uint256)
    {
        return graph[msg.sender][child];
    }

    function connectionStrength(address a, address b)
        external
        view
        returns (uint256)
    {
        return graph[a][b];
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
        graph[msg.sender][to] = amount;

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

        // TODO: check if friend request happened
        uint256 amount = graph[from][msg.sender];
        if (msg.value < amount) revert ConnectionStakeIsTooSmall();

        graph[msg.sender][from] = amount;

        _mint(msg.sender, amount);
        _mint(from, amount);

        emit FriendApproved(from, msg.sender, amount);
    }

    function unfriend(address from) external {
        uint256 abAmount = graph[msg.sender][from];
        uint256 baAmount = graph[from][msg.sender];

        assert(abAmount == baAmount);

        graph[msg.sender][from] = 0;
        graph[from][msg.sender] = 0;
        _burn(msg.sender, abAmount);
        _burn(from, baAmount);
        // require(
        //     IERC20(tokenAddress).transferFrom(address(this), a, abAmount),
        //     "can't transfer"
        // );
        // require(
        //     IERC20(tokenAddress).transferFrom(address(this), b, baAmount),
        //     "can't transfer"
        // );
        (bool res, ) = msg.sender.call{value: abAmount}("");
        if (!res) revert UnfriendWithdrwalFailed();
        (res, ) = from.call{value: baAmount}("");
        if (!res) revert UnfriendWithdrwalFailed();

        emit Unfriended(msg.sender, from, abAmount);
    }

    // IReferralIntro
    function listenCost(address listener) external view returns (uint256) {
        return listenerCosts[listener];
    }

    function listenCostSet(uint256 amount) external {
        listenerCosts[msg.sender] = amount;
    }

    function introduceInitiator(
        address initiator,
        address to,
        uint256 amountToPayForIntro // listen cost of to + 10%
    ) external {
        // save intro data including amount for intro
        introductions[initiator] = Intro(
            msg.sender,
            to,
            amountToPayForIntro,
            0,
            false,
            false
        );
    }

    function coverIntroFee(address referrer, address to) external payable {
        // pay for an introduction + 10%
        // 10% of the stake of referrer and to are locked
        introductions[msg.sender].paid = true;
    }

    function acceptIntro(
        address initiator,
        address referrer,
        uint256 amountStakedOnNewConnection
    ) external payable {
        // create a new connection in graph
        introductions[msg.sender].accepted = true;
        graph[msg.sender][initiator] = amountStakedOnNewConnection;
    }
}
