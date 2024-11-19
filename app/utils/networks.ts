export const betaTestnet = {
  baseUrl: 'https://beta-api.boolscan.com/bool-network-beta',
  rpc: 'https://betatest-rpc-node-http.bool.network',
  chainId: 481,
  symbol: 'tBOL',
  name: 'Bool Beta Testnet',
  value: 'beta_testnet',
  explorer: 'https://beta-testnet.boolscan.com',
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '0xD79d119793f9A7B10A03DFccab6e225fdf901e19',
    consumer: '0x97668c00FdD830cFF4578bD66283E512FE2b9C71',
  },
  tokens: {
    bool: {
      name: 'BOL',
      symbol: 'tBOL',
      decimals: 18,
      icon: 'https://bool.network/bool-orange.png',
      address: '',
    },
    usdc: {
      name: 'USDC',
      address: '0xf9007019014c8CdFA78f21e97995F6a4D3493729',
      icon: '/images/usdt.png',
      symbol: 'USDC',
      decimals: 6,
    },
  },
};

export const sepolia = {
  baseUrl: '',
  rpc: 'https://eth-sepolia-public.unifra.io',
  explorer: 'https://sepolia.etherscan.io',
  chainId: 11155111,
  symbol: 'ETH',
  name: 'Sepolia',
  value: 'sepolia',
  icon: '/images/eth.png',
  contracts: {
    trade: '0x',
    consumer: '0xa557070AF02d09F2Daa3371053B7A6D4bEb8023a',
  },
  tokens: {
    usdc: {
      name: 'USDC',
      address: '0x07540610a807150f3c74b55a0316b5a4735a3225',
      icon: '/images/usdc.png',
      symbol: 'USDC',
      decimals: 6,
    },
  },
};

export const betaMainnet = {
  baseUrl: 'https://beta-mainnet-api.boolscan.com/bool-network-beta-mainnet',
  rpc: 'https://beta-rpc-node-http.bool.network',
  chainId: 11100,
  symbol: 'BOL',
  name: 'Bool Beta Mainnet',
  value: 'beta_mainnet',
  feeRate: 3000,
  explorer: 'https://beta-mainnet.boolscan.com',
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '0x',
    consumer: '0x',
  },
  tokens: {
    bool: {
      name: 'BOL',
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

export const ethereum = {
  baseUrl: '',
  rpc: 'https://rpc.ankr.com/eth',
  explorer: 'https://etherscan.io',
  chainId: 1,
  symbol: 'ETH',
  name: 'Ethereum',
  value: 'ethereum',
  icon: '/images/eth.png',
  contracts: {
    trade: '0x',
    consumer: '0xa557070AF02d09F2Daa3371053B7A6D4bEb8023a',
  },
  tokens: {
    usdc: {
      name: 'USDC',
      address: '0x07540610a807150f3c74b55a0316b5a4735a3225',
      icon: '/images/usdc.png',
      symbol: 'USDC',
      decimals: 6,
    },
  },
};

export const networks = {
  beta_testnet: betaTestnet,
  beta_mainnet: betaMainnet,
  sepolia,
};

export type Network = typeof betaTestnet;

export default networks;
