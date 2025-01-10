export const betaTestnet = {
  rpc: 'https://betatest-rpc-node-http.bool.network',
  chainId: 481,
  symbol: 'tBOL',
  name: 'Bool Beta Testnet',
  value: 'beta_testnet',
  explorer: 'https://beta-testnet.boolscan.com',
  ws: '',
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '0x52295088d335EF9BEDc5837b59cA144c1Fd48983',
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
      icon: '/images/usdc.png',
      symbol: 'USDC',
      decimals: 6,
    },
  },
};

export const ultraLiquidTestnet = {
  rpc: 'https://ultra-test-node-rpc.bool.network',
  chainId: 483,
  symbol: 'tBOL',
  name: 'Ultra Liquid Testnet',
  value: 'ultra_liquid_testnet',
  explorer: 'https://ultra-test-explorer.bool.network',
  ws: 'wss://testnet.xbit.finance/backend/xbit-socket-server/ws',
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '0x52295088d335EF9BEDc5837b59cA144c1Fd48983',
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
      icon: '/images/usdc.png',
      symbol: 'USDC',
      decimals: 6,
    },
  },
};

export const sepolia = {
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
  rpc: 'https://beta-rpc-node-http.bool.network',
  chainId: 11100,
  symbol: 'BOL',
  name: 'Bool Beta Mainnet',
  value: 'beta_mainnet',
  feeRate: 3000,
  explorer: 'https://beta-mainnet.boolscan.com',
  icon: 'https://bool.network/bool-network-orange.png',
  ws: 'wss://',
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

export const ultraLiquidMainnet = {
  rpc: 'https://ultra-node-rpc.bool.network',
  chainId: 11101,
  symbol: 'BOL',
  name: 'Ultra Liquid Mainnet',
  value: 'ultra_liquid_mainnet',
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
