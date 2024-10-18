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
};

export type Network = typeof betaTestnet;

export default {
  beta_testnet: betaTestnet,
};
