export const betaTestnet = {
  baseUrl: 'https://beta-api.boolscan.com/bool-network-beta',
  rpc: 'https://betatest-rpc-node-http.bool.network',
  wss: 'wss://betatest-rpc-node-ws.bool.network',
  chainId: 481,
  symbol: 'tBOL',
  name: 'Beta Testnet',
  value: 'beta_testnet',
  feeRate: 3000,
  explorer: 'https://beta-testnet.boolscan.com',
  contracts: {
    trade: '0xcBdD434B6eCccdBD5DD4264FD7473A38EfFbE294',
  },
  tokens: {
    bool: {
      name: 'BOOL',
      symbol: 'tBOL',
      decimals: 18,
      icon: '/images/bool_circle_fill_pink.png',
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
};
