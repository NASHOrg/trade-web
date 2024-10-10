import { BitgetWallet } from './bitget';
import { GateWallet } from './gate';
import { OkxWallet } from './okx';
import { UnisatWallet } from './unisat';
import { bitcoinWalletInfos } from './utils';
import type { ConnectedWallet } from '~/types/common';

export type BitcoinWalletType = keyof typeof bitcoinWalletInfos | 'get';

type BitcoinWalletMap = {
  unisat: UnisatWallet;
  bitget: BitgetWallet;
  okx: OkxWallet;
  gate: GateWallet;
  get: any;
};

type ReturnProvider<T extends BitcoinWalletType> = T extends keyof BitcoinWalletMap ? BitcoinWalletMap[T] : undefined;

export function getBitcoinWalletProvider<K extends BitcoinWalletType>(wallet: K): ReturnProvider<K> {
  const walletMap: BitcoinWalletMap = {
    unisat: new UnisatWallet(),
    bitget: new BitgetWallet(),
    okx: new OkxWallet(),
    gate: new GateWallet(),
    get: {},
  };

  return walletMap[wallet];
}

export function getBitcoinWallets(): ConnectedWallet<'bitcoin'>[] {
  return [
    {
      ...bitcoinWalletInfos.unisat,
      provider: getBitcoinWalletProvider('unisat'),
    },
    {
      ...bitcoinWalletInfos.bitget,
      provider: getBitcoinWalletProvider('bitget'),
    },
    {
      ...bitcoinWalletInfos.okx,
      provider: getBitcoinWalletProvider('okx'),
    },
    {
      ...bitcoinWalletInfos.gate,
      provider: getBitcoinWalletProvider('gate'),
    },
  ];
}
