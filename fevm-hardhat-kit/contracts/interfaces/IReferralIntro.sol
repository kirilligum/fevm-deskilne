// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IReferralIntro {
    function createProfile(bytes calldata profileCid, address referrer)
        external
        payable;

    function listenCost(address listener) external view returns (uint256);

    function listenCostSet(uint256 amount) external;

    function introduceInitiator(
        address initiator,
        address to,
        uint256 amountToPayForIntro // listen cost of to + 10%
    ) external;

    function coverIntroFee(address referrer, address to) external payable;

    function acceptIntro(
        address initiator,
        address referrer,
        uint256 amountStakedOnNewConnection
    ) external payable;
}
