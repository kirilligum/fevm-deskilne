


export default function AddConnectionButton(props: { targetAddress: string, callback: Function }): JSX.Element {
  return <button onClick={() => props.callback()}>
    Add this connection
  </button>
}