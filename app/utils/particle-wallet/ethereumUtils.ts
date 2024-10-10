import type {
  PrefixedHexString } from '@ethereumjs/util';
import {
  intToHex,
  isHexString,
  padToEven,
  publicToAddress,
  toChecksumAddress,
  toRpcSig,
} from '@ethereumjs/util';
import { hexToBytes as _unprefixedHexToBytes } from 'ethereum-cryptography/utils.js';

import bitcore from 'bitcore-lib';

const hexByByte = Array.from({ length: 256 }, (_v, i) =>
  i.toString(16).padStart(2, '0'),
);
const BIGINT_0 = BigInt(0);

export const unprefixedHexToBytes = (inp: string) => {
  if (inp.slice(0, 2) === '0x') {
    throw new Error('hex string is prefixed with 0x, should be unprefixed');
  }
  else {
    return _unprefixedHexToBytes(padToEven(inp));
  }
};

export const intToBytes = (i: number): Uint8Array => {
  const hex = intToHex(i);
  return hexToBytes(hex);
};

export interface TransformabletoBytes {
  toBytes?(): Uint8Array;
}
export type ToBytesInputTypes =
  | PrefixedHexString
  | number
  | bigint
  | Uint8Array
  | number[]
  | TransformabletoBytes
  | null
  | undefined;

export const hexToBytes = (hex: string): Uint8Array => {
  if (typeof hex !== 'string') {
    throw new TypeError(
      `hex argument type ${typeof hex} must be of type string`,
    );
  }

  if (!hex.startsWith('0x')) {
    throw new Error(
      `prefixed hex input should start with 0x, got ${hex.substring(0, 2)}`,
    );
  }

  hex = hex.slice(2);

  if (hex.length % 2 !== 0) {
    hex = padToEven(hex);
  }

  const byteLen = hex.length / 2;
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i++) {
    const byte = parseInt(hex.slice(i * 2, (i + 1) * 2), 16);
    bytes[i] = byte;
  }
  return bytes;
};

export const toBytes = (v: ToBytesInputTypes): Uint8Array => {
  if (v === null || v === undefined) {
    return new Uint8Array();
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Uint8Array.from(v);
  }

  if (typeof v === 'string') {
    if (!isHexString(v)) {
      throw new Error(
        `Cannot convert string to Uint8Array. toBytes only supports 0x-prefixed hex strings and this string was given: ${v}`,
      );
    }
    return hexToBytes(v);
  }

  if (typeof v === 'number') {
    return intToBytes(v);
  }

  if (typeof v === 'bigint') {
    if (v < BIGINT_0) {
      throw new Error(
        `Cannot convert negative bigint to Uint8Array. Given: ${v}`,
      );
    }
    let n = v.toString(16);
    if (n.length % 2) n = '0' + n;
    return unprefixedHexToBytes(n);
  }

  if (v.toBytes !== undefined) {
    // converts a `TransformableToBytes` object to a Uint8Array
    return v.toBytes();
  }

  throw new Error('invalid type');
};

export const bytesToHex = (bytes: Uint8Array): string => {
  let hex = '0x';
  if (bytes === undefined || bytes.length === 0) return hex;
  for (const byte of bytes) {
    hex += hexByByte[byte];
  }
  return hex;
};
export const pubKeyToEVMAddress = (pubKey: string) => {
  const address = toChecksumAddress(
    bytesToHex(publicToAddress(Buffer.from(toBytes(`0x${pubKey}`)), true)),
  );
  return address;
};

export const convertSignature = (signature: string) => {
  const sig = (bitcore.crypto.Signature as any).fromCompact(
    Buffer.from(signature, 'base64'),
  );
  const v = BigInt(sig.i + 27);
  const evmSig = toRpcSig(v, sig.r.toBuffer(), sig.s.toBuffer());
  return evmSig;
};
