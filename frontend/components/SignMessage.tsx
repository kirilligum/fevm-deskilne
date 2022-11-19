import React, { useRef } from "react";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
export function SignMessage() {
  const recoveredAddress = useRef<string>()
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    }
  })


  return <form
    onSubmit={e => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget!)
      const message: string = formData.get('message')?.toString() ?? "";
      signMessage({ message })

    }}>
    <label htmlFor="message">Enter a message to sign</label>
    <textarea
      id="message"
      name="message"
      placeholder="the quick brown fox..." />
    <button disabled={!isLoading}>
      {isLoading ? 'check wallet' : 'Sign Message'}
    </button>
    {data && <div>
      <div>Recovered Address: {recoveredAddress.current}</div>
      <div>Signature: {data}</div>
    </div>
    }
    {error && <div>{error.message}</div>}


  </form>
}