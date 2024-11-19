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
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '0xD79d119793f9A7B10A03DFccab6e225fdf901e19',
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
  bridge: {
    usdc: [
      {
        name: 'ETH Sepolia',
        chainId: 11155111,
        symbol: 'ETH',
        icon: 'https://oss.boolscan.com/token-logo/1417150d35702e6d774167ae785d94913f09bc.png',
        explorer: 'https://sepolia.etherscan.io',
        consumer: '0xa557070AF02d09F2Daa3371053B7A6D4bEb8023a',
        tokens: {
          decimals: 6,
          name: 'USDC',
          symbol: 'USDC',
          icon: '/images/usdc.png',
          address: '0x07540610a807150f3c74b55a0316b5a4735a3225',
        },
      },
      {
        name: 'Bool Beta Testnet',
        chainId: 481,
        symbol: 'tBOL',
        icon: 'https://bool.network/bool-network-orange.png',
        explorer: 'https://beta-testnet.boolscan.com',
        consumer: '0x97668c00FdD830cFF4578bD66283E512FE2b9C71',
        tokens: {
          name: 'USDC',
          decimals: 6,
          symbol: 'USDC',
          icon: '/images/usdc.png',
          address: '0xf9007019014c8CdFA78f21e97995F6a4D3493729',
        },
      },
    ],
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
  icon: 'https://bool.network/bool-network-orange.png',
  contracts: {
    trade: '',
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
  bridge: {
    usdt: [
      {
        name: 'ETH Sepolia',
        chainId: 11155111,
        symbol: 'ETH',
        icon: 'https://oss.boolscan.com/token-logo/1417150d35702e6d774167ae785d94913f09bc.png',
        consumer: '0xa49e678eccb9922ca6293bbde16db4403f609eb8',
        explorer: 'https://sepolia.etherscan.io',
        tokens: {
          decimals: 6,
          name: 'USDT',
          symbol: 'USDT',
          icon: '/images/usdt.png',
          address: '0x07540610a807150f3c74b55a0316b5a4735a3225',
        },
      },
      {
        name: 'Bool Beta Mainnet',
        chainId: 11100,
        symbol: 'BOL',
        icon: 'https://bool.network/bool-network-orange.png',
        consumer: '0x0015035658f57c613102a33d8c97d4441c520ea1',
        explorer: 'https://beta-testnet.boolscan.com',
        tokens: {
          decimals: 6,
          name: 'USDT',
          symbol: 'USDT',
          icon: '/images/usdt.png',
          address: '0xf9007019014c8CdFA78f21e97995F6a4D3493729',
        },
      },
    ],
  },
};

export const networks = {
  beta_testnet: betaTestnet,
  beta_mainnet: betaMainnet,
};

export type Network = typeof betaTestnet;

export default networks;
