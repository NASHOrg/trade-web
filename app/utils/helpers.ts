import BigNumber from 'bignumber.js';
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

export function generateRandomNumber() {
  return (Math.floor(Math.random() * 100000000) + 1).toString();
}

export const errorHandling = (error: any): Error => {
  if (error instanceof Error) {
    let message = error.message;

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

export function formatAmount(
  value: string,
  decimal = 6,
  options?: { endPad?: boolean; format?: boolean; rounded?: boolean },
) {
  const amount = new BigNumber(value);
  const roundedMode = options?.rounded ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN;

  if (!options?.format) {
    return amount
      .dp(decimal, roundedMode)
      .toFormat(options?.endPad ? decimal : undefined);
  }
  const units = {
    tenThousand: new BigNumber('10000'),
    million: new BigNumber('1000000'),
    billion: new BigNumber('1000000000'),
    trillion: new BigNumber('1000000000000'),
  };

  const minimum = BigNumber(1).div(BigNumber(10).pow(decimal));

  if (amount.isLessThan(minimum)) {
    /// return with 0.{decimal}f format
    return amount.toString().replace(/0\.(0+)([1-9][0-9]*)/, (match, zeros, rest) => {
      return `0.{${zeros.length}}${BigNumber(rest).dp(2).toString()}`;
    });
  }

  if (amount.isGreaterThanOrEqualTo(units.trillion)) {
    return `${amount
      .dividedBy(units.trillion)
      .dp(decimal)
      .toFormat(options?.endPad ? decimal : undefined)}T`;
  }
  else if (amount.isGreaterThanOrEqualTo(units.billion)) {
    return `${amount
      .dividedBy(units.billion)
      .dp(decimal)
      .toFormat(options?.endPad ? decimal : undefined)}B`;
  }
  else if (amount.isGreaterThanOrEqualTo(units.million)) {
    return `${amount
      .dividedBy(units.million)
      .dp(decimal)
      .toFormat(options?.endPad ? decimal : undefined)}M`;
  }
  else if (amount.isGreaterThanOrEqualTo(units.tenThousand)) {
    return `${amount
      .dividedBy(units.tenThousand)
      .multipliedBy('10')
      .dp(decimal)
      .toFormat(options?.endPad ? decimal : undefined)}K`;
  }
  else {
    return `${amount
      .dp(decimal)
      .toFormat(options?.endPad ? decimal : undefined)}`;
  }
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

export function handleJsonRpcError(error: any, message: any) {
  if ('message' in error) {
    if (error.message.includes('user rejected')) {
      message.error('User rejected the request');
    }
    else if (error.message.includes('Already airdrop')) {
      message.error('You have claimed airdrop already');
    }
    else if (error.message === 'withdraw_paused') {
      message.info('Withdraw is temporarily suspended at the moment.');
    }
    else if (
      error.message.includes(
        'insufficient funds for intrinsic transaction cost',
      )
      || error.message.includes('missing revert data')
      || error.message === 'insufficient_balance'
    ) {
      message.error('Insufficient balance');
    }
    else if (
      error?.data?.message?.includes('gas required exceeds allowance')
    ) {
      message.error('Insufficient balance');
    }
    else if (
      error.message.includes('missing revert data in call exception')
    ) {
      message.error('JsonRpc error, please try again later');
    }
    else {
      try {
        errorHandling(error);
      }
      catch (err) {
        if (err instanceof Error) {
          message.error(err.message);
        }
      }
    }
  }
}
