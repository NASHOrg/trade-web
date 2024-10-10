import { HttpApi, JettonMaster, TonClient } from '@ton/ton';
import { CHAIN } from '@tonconnect/sdk';
import { Address, beginCell, Cell } from '@ton/core';
import TonWeb from 'tonweb';
import type { Slice } from '@ton/core';
import { apiKey, MAINNET_API, TESTNET_API } from './utils';

export class BaseTonApi {
  constructor(network: CHAIN) {
    this.network = network;
    /** Client api */
    const client = new TonClient({
      endpoint:
        (network === CHAIN.MAINNET ? MAINNET_API : TESTNET_API) + '/jsonRPC',
      apiKey,
    });

    /** Ton api */
    const tonApi = new HttpApi(client.parameters.endpoint, {
      timeout: client.parameters.timeout,
      apiKey,
      adapter: client.parameters.httpAdapter,
    });

    this.tonApi = tonApi;
    this.client = client;
  }

  tonApi!: HttpApi;
  client!: TonClient;
  network!: CHAIN;

  /**
   *
   * @param contract // token contract address
   * @param owner // account address
   * @returns Jetton address
   *
   * 解析出Jetton address
   *
   */
  async getJettonWalletAddress(
    contract: string,
    owner: string,
  ): Promise<string> {
    if (this.network === CHAIN.TESTNET) {
      const jettonCode = Cell.fromBase64(
        'te6cckECEQEAAyMAART/APSkE/S88sgLAQIBYgIDAgLMBAUAG6D2BdqJofQB9IH0gahhAgHUBgcCASAICQDDCDHAJJfBOAB0NMDAXGwlRNfA/AM4PpA+kAx+gAxcdch+gAx+gAwc6m0AALTH4IQD4p+pVIgupUxNFnwCeCCEBeNRRlSILqWMUREA/AK4DWCEFlfB7y6k1nwC+BfBIQP8vCAAET6RDBwuvLhTYAIBIAoLAIPUAQa5D2omh9AH0gfSBqGAJpj8EIC8aijKkQXUEIPe7L7wndCVj5cWLpn5j9ABgJ0CgR5CgCfQEsZ4sA54tmZPaqQB8VA9M/+gD6QCHwAe1E0PoA+kD6QNQwUTahUirHBfLiwSjC//LiwlQ0QnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJIPkAcHTIywLKB8v/ydAE+kD0BDH6ACDXScIA8uLEd4AYyMsFUAjPFnD6AhfLaxPMgMAgEgDQ4AnoIQF41FGcjLHxnLP1AH+gIizxZQBs8WJfoCUAPPFslQBcwjkXKRceJQCKgToIIJycOAoBS88uLFBMmAQPsAECPIUAT6AljPFgHPFszJ7VQC9ztRND6APpA+kDUMAjTP/oAUVGgBfpA+kBTW8cFVHNtcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQUA3HBRyx8uLDCvoAUaihggiYloBmtgihggiYloCgGKEnlxBJEDg3XwTjDSXXCwGAPEADXO1E0PoA+kD6QNQwB9M/+gD6QDBRUaFSSccF8uLBJ8L/8uLCBYIJMS0AoBa88uLDghB73ZfeyMsfFcs/UAP6AiLPFgHPFslxgBjIywUkzxZw+gLLaszJgED7AEATyFAE+gJYzxYBzxbMye1UgAHBSeaAYoYIQc2LQnMjLH1Iwyz9Y+gJQB88WUAfPFslxgBDIywUkzxZQBvoCFctqFMzJcfsAECQQIwB8wwAjwgCwjiGCENUydttwgBDIywVQCM8WUAT6AhbLahLLHxLLP8ly+wCTNWwh4gPIUAT6AljPFgHPFszJ7VSV6u3X',
      );

      const data = beginCell()
        .storeCoins(0)
        .storeAddress(Address.parse(owner)) // owner
        .storeAddress(Address.parse(contract)) // token addr
        .storeRef(jettonCode)
        .endCell();

      const stateInit = beginCell()
        .storeBit(false)
        .storeBit(false)
        .storeBit(true)
        .storeBit(true)
        .storeBit(false)
        .storeRef(jettonCode)
        .storeRef(data)
        .endCell();
      const hash = stateInit.hash();

      const rawAddr = '0:'.concat(hash.toString('hex'));
      const walletAddress = Address.parseRaw(rawAddr).toString();

      return walletAddress;
    }
    else {
      const jettonMaster = new JettonMaster(Address.parse(contract));
      const address = await this.client
        .open(jettonMaster)
        .getWalletAddress(Address.parse(owner));

      return address.toString();
    }
  }

  /**
   *
   * @param options GetBalance
   * @returns
   *
   * 获取原生币余额
   *
   * 获取代币余额
   *
   */
  async getBalance(param?: {
    contract?: string;
    address: string;
  }): Promise<string> {
    let _address: string | Address | undefined = param?.address;
    if (!_address) {
      return '0';
    }
    _address = Address.parse(_address);

    if (!Address.isAddress(_address)) {
      throw new Error('Invalid address');
    }

    if (param?.contract) {
      // 代币
      const walletAddress = await this.getJettonWalletAddress(
        param.contract,
        _address.toString(),
      );
      const tonweb = new TonWeb(
        new TonWeb.HttpProvider(this.client.parameters.endpoint, { apiKey }),
      );
      const jettonWallet = new TonWeb.token.jetton.JettonWallet(
        tonweb.provider,
        { address: walletAddress },
      );
      const _data = await jettonWallet.getData();
      const balance = _data.balance.toString();
      return balance.toString();
    }
    else {
      // 原生币
      const res = await this.client.getBalance(_address);
      return res.toString();
    }
  }

  /**
   *
   * @param slice
   * @returns
   *
   * 解析发送交易后的结果hash
   */
  getInMessageHash(slice: Slice): string {
    const msgRef = slice.loadRef();
    const msgSlice = msgRef.beginParse();
    return msgSlice.loadRef().hash().toString('base64');
  }

  /**
   *
   * @param boc // 交易返回的boc
   * @param contract // 交易交互的合约地址
   * @returns hash
   *
   * 从Rpc api中获取当前交易的hash
   */
  async getTransactionHash(
    boc: string,
    contract: string,
    address: string,
  ): Promise<ReturnType<typeof this.tonApi.getTransactions>> {
    const cell = Cell.fromBase64(boc);
    const srcHash = cell.hash().toString('base64');

    // 获取In message data > hash
    const tx = await new Promise<any>((resolve) => {
      // let count = 0
      const getTx = async () => {
        let res;
        try {
          res = await this.tonApi.getTransactions(Address.parse(address), {
            limit: 10,
            archival: true,
          } as any);
        }
        finally {
          const tx = (res ?? []).find((item) => {
            const cell = Cell.fromBoc(
              Buffer.from(item.data, 'base64'),
            )?.[0]?.beginParse();

            const inHash = cell ? this.getInMessageHash(cell) : '';
            return inHash.toLowerCase() === srcHash.toLowerCase();
          });
          if (tx) {
            resolve(tx);
          }
          else {
            await new Promise((resolve) => {
              setTimeout(async () => {
                // count++
                await getTx();
                resolve('');
              }, 8000);
            });
          }
        }
      };

      getTx();
    });

    const outMessage = tx?.out_msgs[0];
    if (!outMessage) {
      throw new Error('Query tx message error');
    }

    // 获取Out message data > hash, 最终输出交易hash
    const outTx = await new Promise<
      ReturnType<typeof this.tonApi.getTransactions>
    >((resolve) => {
      // let count = 0

      const getTx = async () => {
        let res;
        try {
          res = await this.tonApi.getTransactions(Address.parse(contract), {
            archival: true,
            limit: 10,
          } as any);
        }
        finally {
          const _outTx = (res ?? []).find((item) => {
            const msgs = item.in_msg;
            return (
              msgs?.created_lt === outMessage.created_lt
              && msgs?.body_hash === outMessage.body_hash
            );
          });
          if (_outTx) {
            resolve([_outTx] as any);
          }
          else {
            await new Promise((resolve) => {
              setTimeout(async () => {
                // count++
                await getTx();
                resolve([]);
              }, 4000);
            });
          }
        }
      };

      getTx();
    });

    if (outTx) {
      return outTx;
    }
    else {
      throw new Error('Query tx message error');
    }
  }
}
