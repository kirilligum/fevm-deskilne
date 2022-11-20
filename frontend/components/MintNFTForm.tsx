import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ControlFunctions, useDebounce } from "use-debounce";

export function MintNFTForm(props: { adddress: string }): JSX.Element {
  const [tokenId, setTokenId] = useState("");

  const { address } = useAccount()
  const debouncedTokenId: [string, ControlFunctions] = useDebounce(
    tokenId,
    500,
  );
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: props.adddress,
    abi: [
      {
        name: "introduceInitiator",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "uint32", name: "tokenId", type: "uint32" }],
        outputs: [],
      },
    ],
    functionName: "introduceInitiator",
    args: [parseInt(debouncedTokenId[0])],
    enabled: Boolean(debouncedTokenId[0]),
  });
  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}
    >
      <label htmlFor="tokenId">Token ID</label>
      <input
        id="tokenId"
        placeholder="420"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button disabled={!write || isLoading}>
        {isLoading ? "Minting..." : "Mint"}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a
              href={`https://explorer.glif.io/tx/${data
                ?.hash}/?network=wallaby`}
            >
              Etherscan
            </a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </form>
  );
}
