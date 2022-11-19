import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';
type ProviderLinkOptions = {
  appName: any;
  networkUrl: any;
  chainId: any;
};
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID // required
    }
  },
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)'
    },
    options: {
      appName: 'Coinbase',
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1
    },
    package: WalletLink,
    connector: async (_: any, options: ProviderLinkOptions) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    }
  }
};
export let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: false,
    providerOptions // required
  });
}
type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: number;
};
type ActionType = {
  type: 'SET_WEB3_PROVIDER';
  provider?: StateType['provider'];
  web3Provider?: StateType['web3Provider'];
  address?: StateType['address'];
  chainId?: StateType['chainId'];
} |
{
  type: 'SET_ADDRESS';
  address?: StateType['address'];
} |
{
  type: 'SET_CHAIN_ID';
  chainId?: StateType['chainId'];
} |
{
  type: 'RESET_WEB3_PROVIDER';
};
export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined
};
export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}
