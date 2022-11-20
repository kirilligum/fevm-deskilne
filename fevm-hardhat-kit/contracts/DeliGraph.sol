// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {SwitchToken} from "./DeliToken.sol";

contract DeliGraph is SwitchToken {
    error ConnectionStakeIsTooSmall();

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

    constructor() SwitchToken() {}

    function erc20TokenID(address tokenAddress) public view returns (uint256) {
        return uint256(uint160(tokenAddress));
    }

    function strength(address child) external view returns (uint256 weight) {
        weight = strength(msg.sender, child);
    }

    function strength(address a, address b)
        external
        view
        returns (uint256 weight)
    {
        weight = graph[a][b];
    }

    // stake amount on the connection with to
    function requestFriend(address to, uint256 amount) external {
        // require(
        //     IERC20(tokenAddress).transferFrom(
        //         msg.sender,
        //         address(this),
        //         amount
        //     ),
        //     "can't transfer"
        // );

        if (msg.value != amount) revert ConnectionStakeIsTooSmall();
        // Store staked native token (FIL) on connection from sender to a friend
        graph[msg.sender][to] = amount;

        emit FreindRequested(msg.sedner, to, amount);
    }

    // stake amount on the connection with from (2-sided connection now)
    function approveFriend(address from) external {
        // require(
        //     IERC20(tokenAddress).transferFrom(
        //         msg.sender,
        //         address(this),
        //         amount
        //     ),
        //     "can't transfer"
        // );

        // TODO: check if friend request happened
        amount = graph[from][msg.sender];
        if (msg.value != amount) revert ConnectionStakeIsTooSmall();

        graph[msg.sender][from] = amount;

        _mint(msg.sender, amount);
        _mint(from, amount);

        emit FriendApproved(from, msg.sender, amount);
    }

    function unfriend(address a, address b) external {
        abAmount = graph[a][b];
        baAmount = graph[b][a];

        assert(abAmount == baAmount, "Something is wrong, stake must be equal");

        graph[a][b] = 0;
        graph[b][a] = 0;
        _burn(msg.sender, erc20TokenID(tokenAddress), amount);
        _burn(from, erc20TokenID(tokenAddress), amount);
        require(
            IERC20(tokenAddress).transferFrom(address(this), a, abAmount),
            "can't transfer"
        );
        require(
            IERC20(tokenAddress).transferFrom(address(this), b, baAmount),
            "can't transfer"
        );
    }

    // IReferralIntro
    function createProfile(bytes cid, address referrer) external {
        profiles[msg.sender] = cid;
        uint256 referrerStake = graph[referrer][msg.sender];
        graph[msg.sender][referrer] = referrerStake;
    }

    function listenCost(address listener) external view {
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
            0
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
