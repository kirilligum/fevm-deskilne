import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ethers } from "ethers";

export async function sendCoin( contractaddress: any, amount: any, toaccount: any,network:any ) {
    const contractAddr =contractaddress
    const toAccount =toaccount
    const SimpleCoin = await ethers.getContractFactory("SimpleCoin")
    const accounts = await ethers.getSigners()
    const signer = accounts[0]
    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

    async function callRpc(method: string, params: undefined) {
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
        axios(options).then((r: AxiosResponse) => {
           return JSON.parse(r.data).result;
        })
      }

    const simpleCoinContract = new ethers.Contract(contractAddr, SimpleCoin.interface, signer)
    console.log("Sending:", amount, "SimpleCoin to", toAccount)
    await simpleCoinContract.sendCoin(toAccount, amount, {
        gasLimit: 1000000000,
        maxPriorityFeePerGas: priorityFee
    })
    let result = BigInt(await simpleCoinContract.getBalance(toAccount)).toString()
    console.log("Total SimpleCoin at:", toAccount, "is", result)
}
