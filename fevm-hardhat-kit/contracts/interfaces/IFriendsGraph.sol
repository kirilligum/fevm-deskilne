// SPDX-Licensee-Identifier: MIT
pragma solidity ^0.8.17;

interface IFriendsGraph {
    function myConnectionStrength(address child)
        external
        view
        returns (uint256 weight);

    function connectionStrength(address a, address b)
        external
        view
        returns (uint256 weight);

    // stake amount on the connection with to
    function requestFriend(address to, uint256 amount) external payable;

    // stake amount on the connection with from based on previous friend request
    function approveFriend(address from) external payable;

    function unfriend(address a, address b) external;
}
