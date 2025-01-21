<script lang="ts" setup>
import BN from 'bignumber.js';
import { ethers, formatEther, MaxUint256 } from 'ethers';
import { toast } from 'vue-sonner';
import type { BridgeHistory, Token } from '~/types/common';
import { BaseEvmApi } from '~/utils/contracts/api';
import { BridgeApi } from '~/utils/contracts/bridge';
import { SwapApi } from '~/utils/contracts/swap';

const props = defineProps<{
  token: Token;
}>();

const { t } = useI18n();
const { network, bridgeNetworks } = useNetworkConfig();
const { address, chainId, switchNetwork, provider } = useWallet();

const modal = useModal();
const amount = ref('');
const confirming = ref(false);
const { add } = useBridgeHistory();

const selectedNetwork = ref(
  bridgeNetworks.find(item => Object.values(item.tokens).some(token => token.symbol.toLowerCase() === props.token.symbol.toLowerCase()))!,
);

const networkOptions = computed(() => {
  return bridgeNetworks.filter(item => Object.values(item.tokens).some(token => token.symbol.toLowerCase() === props.token.symbol.toLowerCase())).map((item) => {
    return [
      {
        label: item.name,
        avatar: {
          src: item.icon,
        },
        disabled: item.chainId === selectedNetwork.value.chainId,
        click: () => {
          selectedNetwork.value = item;
        },
      },
    ];
  });
});

const tokenInTarget: ComputedRef<Token> = computed(() => {
  return Object.values(selectedNetwork.value.tokens).find(
    (item: Token) => item.symbol.toLowerCase() === props.token.symbol.toLowerCase(),
  )!;
});

const tokenInSource: ComputedRef<Token> = computed(() => {
  return Object.values(network.tokens).find(
    (item: Token) => item.symbol.toLowerCase() === props.token.symbol.toLowerCase(),
  )!;
});

const { data: balanceInBool } = useAsyncData(
  `withdraw-data-network-balance-${props.token.symbol}`,
  () => {
    if (!address.value) {
      return Promise.resolve(BigInt(0));
    }
    const networkApi = new BaseEvmApi(network.rpc);
    return networkApi.getBalance({
      address: address.value,
      contractAddress: props.token.address,
    });
  },
  {
    server: false,
  },
);

const { data: bridgeFee } = useAsyncData(
  `withdraw-fee-${props.token.symbol}`,
  async () => {
    if (!address.value) {
      return Promise.resolve({ fee: BigInt(0), feeRatio: 0 });
    }
    const consumer = network.contracts.consumer;
    let fee: bigint | undefined;
    let feeRatio: number | undefined;
    if (tokenInTarget.value.pool) {
      const toNetworkApi = new SwapApi(selectedNetwork.value.rpc, selectedNetwork.value.contracts.consumer);
      feeRatio = await toNetworkApi.swapFeeRatio(tokenInTarget.value);
    }
    else {
      const bridgeApi = new BridgeApi(network.rpc, consumer);
      fee = await bridgeApi.getBridgeFee({
        dstChainId: selectedNetwork.value.chainId,
        amount: 0n,
        dstRecipient: '0xB4350Ea18a153e9077c1067Fa8Ff3654123F6',
      });
    }
    return {
      fee,
      feeRatio,
    };
  },
  {
    server: false,
    watch: [address, selectedNetwork],
  },
);

const items = computed(() => {
  const balanceInBoolFormat = ethers.formatUnits(
    balanceInBool.value ?? '0',
    props.token.decimals,
  );
  let fee;
  if (tokenInTarget.value.pool) {
    fee = `${BN(amount.value || '0').times(bridgeFee.value?.feeRatio ?? 0).toString()} ${tokenInTarget.value?.symbol}`;
  }
  else {
    fee = `${formatEther(bridgeFee.value?.fee ?? 0n)} ${network.symbol}`;
  }
  return [
    {
      label: 'Balance ',
      value: `${formatAmount(
        balanceInBoolFormat,
        5,
      )} ${props.token.symbol}`,
    },
    { label: 'Fee', value: fee,
    },
  ];
});

function onMax() {
  amount.value = ethers.formatUnits(
    balanceInBool.value || '0',
    tokenInTarget.value.decimals,
  );
}

async function onSubmit() {
  try {
    if (!amount.value) {
      throw new Error('Please input amount!');
    }
    else if (!selectedNetwork.value) {
      throw new Error('Please select network!');
    }
    else if (!address.value) {
      throw new Error('Wallet is not connected.');
    }
    confirming.value = true;

    // Check wallet network
    if (chainId.value !== network.chainId) {
      const result = await switchNetwork(network.chainId);
      if (!result) return;
    }

    const consumer = network.contracts.consumer;
    const bridgeApi = new BridgeApi(network.rpc, consumer);

    const amountParse = ethers.parseUnits(
      amount.value,
      props.token.decimals,
    );

    const approveParam = {
      contract: props.token.address!,
      approvedAddress: consumer,
      address: address.value,
      amount: amountParse,
    };

    const evmApi = new BaseEvmApi(network.rpc);
    const isApproved = await evmApi.isApprove(approveParam);

    if (!isApproved) {
      const approveTx = await evmApi.approve(provider(), {
        ...approveParam,
        amount: MaxUint256,
      });
      await new Promise((resolve, reject) => {
        toast.promise(evmApi.checkTransaction(approveTx.hash), {
          loading: t('sendTransaction'),
          description: t('approve') + ' ' + tokenInTarget.value.symbol,
          success: () => {
            resolve(true);
            return t('transactionSuccess');
          },
          error: () => {
            reject(new Error(t('transactionFail')));
          },
          action: {
            label: t('viewTx'),
            onClick: () => {
              window.open(`${selectedNetwork.value.explorer}/tx/${approveTx.hash}`, '_blank');
            },
          },
        });
      });
    }

    let tx;

    if (tokenInSource.value.pool) {
      const swapApi = new SwapApi(
        network.rpc,
        network.contracts.consumer,
      );
      tx = await swapApi.swap(provider(), {
        poolId: tokenInSource.value.poolId!,
        dstChainId: selectedNetwork.value.chainId,
        amount: amountParse,
        refundAddress: address.value!,
        dstRecipient: address.value!,
        customData: '0x',
        isNative: !props.token.address,
      });
    }
    else {
      const bridgeApi = new BridgeApi(
        selectedNetwork.value.rpc,
        selectedNetwork.value.contracts.consumer,
      );
      tx = await bridgeApi.bridgeOut(provider(), {
        dstChainId: selectedNetwork.value.chainId,
        amount: amountParse,
        dstRecipient: address.value!,
        customData: '0x',
        isNative: !props.token.address,
      });
    }

    const params: BridgeHistory = {
      swapRecordSrcTokenAmount: amount.value,
      swapRecordDstTokenAmount: amount.value,
      swapRecordSrcChainHash: tx.hash,
      swapRecordSrcChainId: network.chainId.toString(),
      swapRecordDstChainId: selectedNetwork.value.chainId.toString(),
      swapRecordDstUserAddress: address.value ?? '',
      swapRecordSrcChainTime: Date.now().toString(),
      swapRecordSrcTokenName: props.token.name,
      swapRecordDstTokenName: tokenInTarget.value.name,
      swapRecordDstTokenSymbol: tokenInTarget.value.symbol,
      swapRecordStatus: 'Pending',
    };
    add(params);
    const tokenKey = `token-balance-${address.value}-${props.token.address ?? ''}`;

    toast.promise(bridgeApi.checkTransaction(tx.hash), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData(tokenKey);
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
      description: `${t('withdraw')} ${amount.value} ${props.token.symbol}`,
      action: {
        label: t('viewTx'),
        onClick: () => {
          window.open(`${network.explorer}/tx/${tx.hash}`, '_blank');
        },
      },
    });
    modal.close();
  }
  catch (err) {
    console.log(err);
    handleJsonRpcError(err, toast);
  }
  finally {
    confirming.value = false;
  }
}
</script>

<template>
  <BasicModal
    :title="t('withdraw')"
    :prevent-close="true"
  >
    <div class="w-full md:px-6 px-3 md:space-y-6 space-y-3">
      <div
        class="w-full flex items-center md:px-7 px-3.5 md:py-6 py-3 bg-[#0E0E11] rounded-lg"
      >
        <div
          class="flex items-center text-white md:space-x-4 space-x-2 md:text-base text-sm leading-4"
        >
          <UAvatar
            :src="token.icon"
            :alt="token.symbol"
            class="w-[30px] h-[30px] bg-gray-500/50"
          />
          <div>{{ token.symbol }}</div>
        </div>
        <div class="grow">
          <CustomInput
            v-model:value="amount"
            placeholder="0.00"
            :precision="5"
            type="number"
            input-class="!text-[16px] !bg-transparent !text-end !text-white"
            block
          />
        </div>
        <div>
          <UButton
            color="primary"
            :ui="{
              rounded: 'rounded-[4px]',
              padding: { md: 'p-1.5' },
              size: { md: 'text-xs leading-3 font-normal' },
            }"
            @click="onMax"
          >
            Max
          </UButton>
        </div>
      </div>

      <UDropdown
        :items="networkOptions"
        :ui="{
          wrapper: 'w-full',
          width: 'w-full',
          item: {
            avatar: {
              base: 'w-[30px] h-[30px] flex-shrink-0',
            },
          },
          popper: {
            strategy: 'absolute',
          },
        }"
      >
        <div
          class="w-full flex items-center md:px-7 px-3.5 md:py-6 py-3 bg-[#0E0E11] rounded-lg select-none"
        >
          <div
            class="flex items-center text-white space-x-4 text-base leading-4"
          >
            <UAvatar
              :src="selectedNetwork.icon"
              :alt="selectedNetwork.name"
              class="w-[30px] h-[30px] bg-gray-500/50"
            />
            <div>{{ selectedNetwork.name }}</div>
          </div>

          <div class="grow" />
          <div>
            <UIcon
              name="i-gridicons-dropdown"
              class="text-4xl text-[#999999]"
            />
          </div>
        </div>
      </UDropdown>

      <div
        class="w-full flex flex-col md:px-7 px-3.5 md:py-4 py-2 bg-[#0E0E11] rounded-lg md:space-y-5 space-y-2.5"
      >
        <div class="w-full flex justify-between">
          <span class="text-base font-normal text-white">Withdraw address</span>
          <span />
        </div>
        <div class="flex md:gap-4 gap-2">
          <UButton
            color="primary"
            class="w-[54px] h-[25px] items-center justify-center text-xs font-normal leading-[14px]"
            :ui="{
              rounded: 'rounded-[4px]',
              padding: { md: 'p-0' },
              variant: {
                outline: 'bg-primary/30 dark:bg-primary/30',
              },
            }"
          >
            {{ t("default") }}
          </UButton>
          <span
            class="text-base font-normal leading-5 text-primary text-ellipsis overflow-hidden"
            :title="address"
          >
            {{ address }}
          </span>
        </div>
      </div>

      <div
        class="w-full flex items-center p-3 bg-[#2D2F36] rounded-lg space-x-2.5"
      >
        <IconInfo class="text-[#C5C5C5] rotate-180 w-9 h-9" />
        <span class="text-sm font-normal leading-4 text-[#999]">
          Please be aware that assets transferred to the wrong address cannot be
          recovered.
        </span>
      </div>

      <div class="w-full md:space-y-4 space-y-2">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="w-full flex justify-between items-center"
        >
          <span class="text-xs font-normal text-[#999]">{{ item.label }}</span>
          <span class="text-sm font-normal text-white">{{ item.value }}</span>
        </div>
      </div>

      <div
        class="w-full flex md:justify-end justify-between gap-3 md:mt-0 !mt-10"
      >
        <UButton
          color="black"
          variant="outline"
          class="text-sm leading-4 font-normal"
          :ui="{
            base: ' md:w-[120px] w-[45%] h-[40px]  justify-center !text-white ',
            rounded: 'rounded-lg',
          }"
          @click="modal.close"
        >
          {{ t("cancel") }}
        </UButton>

        <UButton
          :loading="confirming"
          color="primary"
          class="text-sm leading-4 font-normal"
          :ui="{
            base: 'md:w-[120px]  w-[45%] h-[40px] justify-center ',
            rounded: 'rounded-lg',
          }"
          :disabled="Number(amount || '0') === 0"
          @click="onSubmit"
        >
          {{ t("confirm") }}
        </UButton>
      </div>
    </div>
  </BasicModal>
</template>
