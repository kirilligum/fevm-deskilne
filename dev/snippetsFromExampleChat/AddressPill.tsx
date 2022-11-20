import classNames from './classNames'

export default function AddressPill(props: { address: string, userAddress: string }): JSX.Element {
  const userIsSender = props.address === props.userAddress
  return (
    <div
      className={classNames(
        'rounded-2xl',
        'border',
        'text-md',
        'mr-2',
        'px-2',
        'py-1',
        'font-bold',
        userIsSender ? 'bg-bt-100 text-b-600' : 'bg-zinc-50',
        userIsSender ? 'border-bt-300' : 'border-gray-300'
      )}
    >
      <span
        className={classNames('font-mono',)}
        title={props.address}
      >
        {props.address}
      </span>
    </div>
  )
}
