export const betaTestnet = {
  baseUrl: 'https://beta-api.boolscan.com/bool-network-beta',
  rpc: 'https://betatest-rpc-node-http.bool.network',
  wss: 'wss://betatest-rpc-node-ws.bool.network',
  chainId: 481,
  symbol: 'tBOL',
  name: 'Bool Beta Testnet',
  value: 'beta_testnet',
  feeRate: 3000,
  explorer: 'https://beta-testnet.boolscan.com',
  icon: 'https://bool.network/bool-orange.png',
  contracts: {
    trade: '0x1E3f592CfcEbE18824e19Cb6Ca7Ba8f91939Bca4',
  },
  tokens: {
    bool: {
      name: 'BOOL',
      symbol: 'tBOL',
      decimals: 18,
      icon: 'https://bool.network/bool-orange.png',
      address: '',
    },
    usdt: {
      name: 'USDT',
      address: '0x3fFa3237b30b15eF3368132a2AC9D262d8502bB3',
      icon: '/images/usdt.png',
      symbol: 'USDT',
      decimals: 18,
    },
  },
};

export const betaMainnet = {
  baseUrl: 'https://beta-mainnet-api.boolscan.com/bool-network-beta-mainnet',
  rpc: 'https://beta-rpc-node-http.bool.network',
  wss: 'wss://beta-rpc-node-ws.bool.network',
  chainId: 11100,
  symbol: 'BOL',
  name: 'Bool Beta Mainnet',
  value: 'beta_mainnet',
  feeRate: 3000,
  explorer: 'https://beta-mainnet.boolscan.com',
  icon: 'https://bool.network/bool-orange.png',
  contracts: {
    trade: '',
  },
  tokens: {
    bool: {
      name: 'BOOL',
      symbol: 'BOL',
      decimals: 18,
      address: '',
      icon: 'https://bool.network/bool-orange.png',
    },
    usdt: {
      name: 'USDT',
      address: '0x3fFa3237b30b15eF3368132a2AC9D262d8502bB3',
      icon: '/images/usdt.png',
      symbol: 'USDT',
      decimals: 18,
    },
  },
};

export type Network = typeof betaTestnet;

export default {
  beta_testnet: betaTestnet,
  beta_mainnet: betaMainnet,
};
