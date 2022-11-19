import { ethers } from "ethers"

export async function getBalance(contractAddr: string, account: string, networkId:string) {
  console.log("Reading SimpleCoin owned by", account, " on network ", networkId)
  const SimpleCoin = await ethers.getContractFactory("SimpleCoin")
  // todo this is call on a hardhat helper to the ethers library

  const accounts = await ethers.getSigners()
  const signer = accounts[0]

  const simpleCoinContract = new ethers.Contract(contractAddr, SimpleCoin.interface, signer)
  let result = BigInt(await simpleCoinContract.getBalance(account)).toString()
  console.log("Data is: ", result)
}
