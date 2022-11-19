import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";

export function MintNft(props: { address: string }): JSX.Element {
  const { config } = usePrepareContractWrite({
    address: props.address,
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "mint",
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash })

  return (
    <div>
      <button disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'minting' : 'Mint'}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://explorer.glif.io/tx/${data?.hash}/?network=wallaby`}>Etherscan</a>
          </div>
        </div>
      )}
    </div>
  );
}
