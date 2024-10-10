import type { ConnectedWallet } from '~/types/common';

export const bitcoinWalletInfos = {
  unisat: {
    label: 'UniSat',
    icon: '/images/unisat.png',
    chain: 'bitcoin',
    accounts: [],
  } as ConnectedWallet<'bitcoin'>,
  bitget: {
    label: 'Bitget',
    icon: '/images/bitget.png',
    chain: 'bitcoin',
    accounts: [],
  } as ConnectedWallet<'bitcoin'>,
  okx: {
    label: 'OKX',
    icon: '/images/okx.svg',
    chain: 'bitcoin',
    accounts: [],
  } as ConnectedWallet<'bitcoin'>,
  gate: {
    label: 'Gate',
    icon: '/images/gate.png',
    chain: 'bitcoin',
    accounts: [],
  } as ConnectedWallet<'bitcoin'>,
};
