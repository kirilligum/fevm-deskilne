import fa from "@glif/filecoin-address";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ethers } from "ethers";

function hexToBytes(hex:string):Uint8Array {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substring(c, 2), 16));
  return new Uint8Array(bytes);
}

export default async function getAddress(network:any) {
  async function callRpc(method: string, params: string[] | undefined) {
      var options:AxiosRequestConfig = {
        method: "POST",
        url: "https://wallaby.node.glif.io/rpc/v0",
        // url: "http://localhost:1234/rpc/v0",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          jsonrpc: "2.0",
          method: method,
          params: params,
          id: 1,
        }),
      };
     axios(options).then((v: AxiosResponse) => {
       return JSON.parse(v.data).result;

       })
    }

    const DEPLOYER_PRIVATE_KEY = network.config.accounts[0]
    const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);


    const pubKey = hexToBytes(deployer.publicKey.slice(2));

    // const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

    const f4Address = fa.delegatedFromEthAddress(deployer.address).toString();
    const nonce = await callRpc("Filecoin.MpoolGetNonce", [f4Address]);
    console.log("f4address (for use with faucet) = ", f4Address);
    console.log("Ethereum address:", deployer.address);
}