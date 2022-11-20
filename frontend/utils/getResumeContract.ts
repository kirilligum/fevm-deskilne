import { Contract, ethers } from "ethers";

export function connectWithResumeContract(
  address: string,
  provider: any,
): Contract {
  const abi = [
    "function listenCost(address listener) view",
    "function listenCostSet(address listener, uint amount)",
    "function introduceRequest(address initiator, address through, addres to, uint amountToPayForIntro)",
    "function forwardIntro(address initiator, address through, addres to)",
    "function acceptIntro(address initiator, address through, addres to, uint amountStakedOnNewConnection)",
  ];

  const daiContract = new ethers.Contract(address, abi, provider);
  daiContract.connect("signer");
  return daiContract;
}
