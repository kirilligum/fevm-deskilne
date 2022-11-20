// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

interface IReferralIntro {
    function listenCost(address listener) external view returns (uint256);

    function listenCostSet(uint256 amount) external;

    function introduceInitiator(address initiator, address to) external;

    function coverIntroFee(address referrer, address to) external payable;

    function acceptIntro(
        address initiator,
        address referrer,
        uint256 proposedStake
    ) external payable;
}
