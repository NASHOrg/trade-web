import BigNumber from 'bignumber.js';
import { toast } from 'vue-sonner';
import dayjs from 'dayjs';

export function formatDate(at: number, format = 'YYYY/MM/DD HH:mm:ss') {
  return dayjs(at).format(format);
}
export function shortAddress(address?: string, length: number = 6) {
  if (address == null) return '';
  return (
    address.substring(0, length)
    + '...'
    + address.substring(address.length - length)
  );
}

export async function copyText(str: string) {
  document.addEventListener('copy', (e) => {
    e.clipboardData?.setData('text/plain', str);
    e.preventDefault();
  });
  const isCopy = document.execCommand('copy');
  if (!isCopy) {
    if (!navigator.clipboard) throw Error;
    await navigator.clipboard.writeText(str);
  }
  toast.success('Copied');
  return true;
}

export function generateRandomNumber() {
  return (Math.floor(Math.random() * 100000000) + 1).toString();
}

export const errorHandling = (error: any): Error => {
  if (error instanceof Error) {
    let message = error.message;

    console.log(error.message);

    try {
      const errs = error.message
        ?.split?.('info=')?.[1]
        ?.split?.(', code=')?.[0];
      const messageStr = JSON.parse(errs ?? '{}')?.error?.message;

      if (messageStr) {
        message = messageStr;
      }
      else {
        const m = error.message?.split?.('(')?.[0];
        message = m || message;
      }
    }
    catch (err) {
      const errs = error.message?.split?.('(');
      message = errs?.[0] ?? error.message;
    }
    throw new Error(message);
  }
  else {
    if ('message' in error) {
      if (error.message.includes('user rejected')) {
        throw new Error('User rejected the request');
      }
      else if (error.message === 'withdraw_paused') {
        throw new Error('Withdraw is temporarily suspended at the moment.');
      }
      else if (
        error.message.includes(
          'insufficient funds for intrinsic transaction cost',
        )
        || error.message === 'insufficient_balance'
      ) {
        throw new Error('Insufficient balance');
      }
      else if (
        error?.data?.message?.includes('gas required exceeds allowance')
      ) {
        throw new Error('Insufficient balance');
      }
      else if (
        error.message.includes('missing revert data in call exception')
      ) {
        throw new Error('JsonRpc error, please try again later');
      }
      else {
        throw new Error(error.message);
      }
    }
    else {
      throw new TypeError(
        (
          (error as any)?.data?.message
          ?? (error as any).message
          ?? error
          ?? ''
        ).toString(),
      );
    }
  }
};

export function formaCurrency(value: string, decimal = 6) {
  return BigNumber(value).dp(decimal).toFormat();
}

export function shortFloatNum(i: number | string, position: number): string {
  const str = i.toString().split('.');
  const s1 = str?.[0] || 0;
  const s2 = str[1]?.substring(0, position) || 0;

  const num = Number(`${s1}.${s2}`);

  // 统一小于0时返回0
  if (num < 0) {
    return '0';
  }
  else {
    return num.toString();
  }
}

export function getBitcoinAddressNetwork(address: string) {
  if (
    address.startsWith('bc1')
    || address.startsWith('3')
    || address.startsWith('1')
  ) {
    return 'livenet';
  }
  return 'testnet';
}
