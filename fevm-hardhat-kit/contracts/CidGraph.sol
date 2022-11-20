// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {StdStorage} from "../lib/forge-std/src/Components.sol";
import {specific_authenticate_message_params_parse, specific_deal_proposal_cbor_parse} from "./CBORParse.sol";
// import "./GraphLib.sol";

contract MockMarket {
    function publish_deal(bytes memory raw_auth_params, address callee) public {
        // calls standard filecoin receiver on message authentication api method number
        (bool success, ) = callee.call(abi.encodeWithSignature("handle_filecoin_method(uint64,uint64,bytes)", 0, 2643134072, raw_auth_params));
        require(success, "client contract failed to authorize deal publish");
    }
}

contract CidGraphToken {

    uint64 constant public AUTHORIZE_MESSAGE_METHOD_NUM = 2643134072; 

    mapping(bytes => bool) public cidSet;
    mapping(bytes => uint) public cidSizes;
    mapping(bytes => mapping(bytes => bool)) public cidProviders;

    // Graph public graph;
    // ISwitchToken[][] public g;
    mapping(address => mapping(address => uint256)) private _g;


    address public owner;
    address tokenAddress = 0x6e1A19F235bE7ED8E3369eF73b196C07257494DE;

    constructor() {
        owner = msg.sender;
    }

    function strength(address child) view returns(uint weight) {
      weight = strength(msg.sender, child);
    }

    function strength(address a, address b) view returns(uint weight){
      weight =  _g[a][b];
    }

    function requestFriend(address to, uint amount) {
      require(
          IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount),
          "can't transfer"
      );
      _g[msg.sender][to]=amount;
    }

    function approveFriend(address from){
      amount =_g[from][msg.sender];
      require(
          IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount ),
          "can't transfer"
      );
      _g[msg.sender][from]=amount;
    }

    function unfriend(address a, address b){
      abAmount =_g[a][b];
      baAmount =_g[b][a];
      _g[a][b]=0;
      _g[b][a]=0;
      require(
          IERC20(tokenAddress).transferFrom(address(this), a, abAmount ),
          "can't transfer"
      );
      require(
          IERC20(tokenAddress).transferFrom(address(this), b, baAmount ),
          "can't transfer"
      );
    }

    function addCID(bytes calldata cidraw, uint size) public {
       require(msg.sender == owner);
       cidSet[cidraw] = true;
       cidSizes[cidraw] = size;
    }

    function policyOK(bytes calldata cidraw, bytes calldata provider) internal view returns (bool) {
        bool alreadyStoring = cidProviders[cidraw][provider];
        return !alreadyStoring;
    }

    function authorizeData(bytes calldata cidraw, bytes calldata provider, uint size) public {
        // if (msg.sender != f05) return;
        require(cidSet[cidraw], "cid must be added before authorizing");
        require(cidSizes[cidraw] == size, "data size must match expected");
        require(policyOK(cidraw, provider), "deal failed policy check: has provider already claimed this cid?");

        cidProviders[cidraw][provider] = true;
    }

    function handle_filecoin_method(uint64, uint64 method, bytes calldata params) public {
        // dispatch methods
        if (method == AUTHORIZE_MESSAGE_METHOD_NUM) {
            bytes calldata deal_proposal_cbor_bytes = specific_authenticate_message_params_parse(params);
            (bytes calldata cidraw, bytes calldata provider, uint size) = specific_deal_proposal_cbor_parse(deal_proposal_cbor_bytes);
            authorizeData(cidraw, provider, size);
        } else {
            revert("the filecoin method that was called is not handled");
        }
    }
}
