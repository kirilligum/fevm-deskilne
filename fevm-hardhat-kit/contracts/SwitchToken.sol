// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

import "@zondax/filecoin-solidity-mock-api/contracts/v0.8/MarketAPI.sol";

import {specific_authenticate_message_params_parse, specific_deal_proposal_cbor_parse} from "./CBORParse.sol";

contract SwitchToken is ERC20, Pausable, Ownable, ERC20Permit, ERC20Votes {
    //contract DealClient is ERC20, Pausable, Ownable, ERC20Permit, ERC20Votes {
    uint64 public constant AUTHORIZE_MESSAGE_METHOD_NUM = 2643134072;

    MarketAPI market;

    mapping(bytes => bool) public cidSet;
    mapping(bytes => uint256) public cidSizes;
    mapping(bytes => mapping(bytes => bool)) public cidProviders;

    constructor() ERC20("Switch", "swit") ERC20Permit("SwitchToken") {
        _mint(msg.sender, 10000000 * 10**decimals());

        market = new MarketAPI();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }

    // function _transfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) internal virtual {
    //     revert("power of the connection cannot be transfered");
    // }

    // DealClient

    function addCidToMarket(bytes calldata cid) internal {
        addCID(cid, 2048);
        bytes
            memory messageAuthParams = hex"8240584c8bd82a5828000181e2039220206b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b190800f4420068420066656c6162656c0a1a0008ca0a42000a42000a42000a";
        address a = address(market);

        market.publish_storage_deals(messageAuthParams, a);
        // require(
        //     cidProviders(testCID, testProvider),
        //     "test provider should be added"
        // );
    }

    function addCID(bytes calldata cidraw, uint256 size) internal {
        require(msg.sender == owner());
        cidSet[cidraw] = true;
        cidSizes[cidraw] = size;
    }

    function policyOK(bytes calldata cidraw, bytes calldata provider)
        internal
        view
        returns (bool)
    {
        bool alreadyStoring = cidProviders[cidraw][provider];
        return !alreadyStoring;
    }

    function authorizeData(
        bytes calldata cidraw,
        bytes calldata provider,
        uint256 size
    ) public {
        // if (msg.sender != f05) return;
        require(cidSet[cidraw], "cid must be added before authorizing");
        require(cidSizes[cidraw] == size, "data size must match expected");
        require(
            policyOK(cidraw, provider),
            "deal failed policy check: has provider already claimed this cid?"
        );

        cidProviders[cidraw][provider] = true;
    }

    function handle_filecoin_method(
        uint64,
        uint64 method,
        bytes calldata params
    ) public {
        // dispatch methods
        if (method == AUTHORIZE_MESSAGE_METHOD_NUM) {
            bytes
                calldata deal_proposal_cbor_bytes = specific_authenticate_message_params_parse(
                    params
                );
            (
                bytes calldata cidraw,
                bytes calldata provider,
                uint256 size
            ) = specific_deal_proposal_cbor_parse(deal_proposal_cbor_bytes);
            authorizeData(cidraw, provider, size);
        } else {
            revert("the filecoin method that was called is not handled");
        }
    }
}
