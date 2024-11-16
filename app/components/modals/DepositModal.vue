<script lang="ts" setup>
import { ethers, MaxUint256 } from 'ethers';
import { toast } from 'vue-sonner';
import type { BridgeHistory, Token } from '~/types/common';
import { BaseEvmApi } from '~/utils/contracts/api';
import { BridgeApi } from '~/utils/contracts/bridge';

const props = defineProps<{
  token: Token;
}>();

const { t } = useI18n();
const { network } = useNetworkConfig();
const { address, chainId, switchNetwork, provider } = useWallet();
const { add } = useBridgeHistory();

const modal = useModal();
const amount = ref('');
const confirming = ref(false);

const networks = computed(() => {
  const bridge = network.value.bridge;
  const key = props.token.symbol.toLowerCase() as keyof typeof bridge;
  return bridge[key];
});

const selectNetwork = ref<(typeof networks.value)[0]>(networks.value[0] as any);

const networkOptions = computed(() => {
  return networks.value
    .filter(item => item.chainId !== network.value.chainId)
    .map((item) => {
      return [
        {
          label: item.name,
          avatar: {
            src: item.icon,
          },
          disabled: item.chainId === selectNetwork.value.chainId,
          click: () => {
            selectNetwork.value = item;
          },
        },
      ];
    });
});

const targetNetwork = computed(() => {
  return BaseEvmApi.getChain(selectNetwork.value.chainId);
});

const tokenInBool = computed(() => {
  return networks.value.find(item => item.chainId === network.value.chainId)
    ?.tokens;
});

const tokenInTarget = computed(() => {
  return selectNetwork.value.tokens;
});

const { data: balanceInBool } = useAsyncData(
  `deposit-data-network-balance-${props.token.symbol}`,
  () => {
    if (!address.value) {
      return Promise.resolve(BigInt(0));
    }
    const networkApi = new BaseEvmApi(network.value.rpc);
    return networkApi.getBalance({
      address: address.value,
      contractAddress: tokenInBool.value?.address,
    });
  },
  {
    server: false,
  },
);

const { data: balanceInTarget } = useAsyncData(
  `deposit-data-target-balance-${props.token.symbol}`,
  () => {
    if (!targetNetwork.value || !address.value) {
      return Promise.resolve(BigInt(0));
    }
    const targetApi = new BaseEvmApi(targetNetwork.value?.rpcUrl);
    return targetApi.getBalance({
      address: address.value,
      contractAddress: tokenInTarget.value.address,
    });
  },
  {
    server: false,
  },
);

const items = computed(() => {
  const balanceInBoolFormat = ethers.formatUnits(
    balanceInBool.value ?? '0',
    tokenInBool.value?.decimals,
  );
  const balanceInTargetFormat = ethers.formatUnits(
    balanceInTarget.value ?? '0',
    tokenInTarget.value?.decimals,
  );
  return [
    {
      label: 'Balance in your wallet',
      value: `${formatAmount(
        balanceInTargetFormat,
        tokenInBool.value?.decimals,
      )} ${tokenInBool.value?.symbol ?? ''}`,
    },
    {
      label: 'Balance in Bool Chain',
      value: `${formatAmount(
        balanceInBoolFormat,
        tokenInTarget.value.decimals,
      )} ${tokenInTarget.value.symbol}`,
    },
  ];
});

function onMax() {
  amount.value = ethers.formatUnits(
    balanceInTarget.value || '0',
    tokenInTarget.value.decimals,
  );
}

async function onSubmit() {
  try {
    if (!amount.value) {
      throw new Error('Please input amount!');
    }
    else if (!targetNetwork.value) {
      throw new Error('Please select network!');
    }
    else if (!address.value) {
      throw new Error('Wallet is not connected.');
    }
    confirming.value = true;

    // Check wallet network
    if (chainId.value !== Number(targetNetwork.value.id)) {
      const result = await switchNetwork(Number(targetNetwork.value.id));
      if (!result) return;
    }

    const bridgeApi = new BridgeApi(
      targetNetwork.value.rpcUrl,
      selectNetwork.value.consumer,
    );

    const amountParse = ethers.parseUnits(
      amount.value,
      tokenInTarget.value.decimals,
    );

    const approveParam = {
      contract: tokenInTarget.value.address,
      approvedAddress: selectNetwork.value.consumer,
      address: address.value,
      amount: MaxUint256,
    };

    const isApproved = await bridgeApi.isApprove(approveParam);

    if (!isApproved) {
      const approveTx = await bridgeApi.approve(provider(), {
        ...approveParam,
      });
      await new Promise((resolve, reject) => {
        toast.promise(approveTx.wait(), {
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
              window.open(`${targetNetwork.value!.scanUrl}/tx/${approveTx.hash}`, '_blank');
            },
          },
        });
      });
    }

    const tx = await bridgeApi.bridgeOut(provider(), {
      dstChainId: network.value.chainId,
      amount: amountParse,
      dstRecipient: address.value!,
      customData: '0x',
    });

    const params: BridgeHistory = {
      swapRecordSrcTokenAmount: amount.value,
      swapRecordDstTokenAmount: amount.value,
      swapRecordSrcChainHash: tx.hash,
      swapRecordSrcChainId: Number(targetNetwork.value!.id)?.toString() ?? '',
      swapRecordDstChainId: network.value!.chainId?.toString() ?? '',
      swapRecordDstUserAddress: address.value ?? '',
      swapRecordSrcChainTime: Date.now().toString(),
      swapRecordSrcTokenName: tokenInTarget.value?.name,
      swapRecordDstTokenName: tokenInBool.value?.name,
      swapRecordDstTokenSymbol: tokenInTarget.value.symbol,
      swapRecordStatus: 'Pending',
    };
    add(params);

    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
      description: `${t('deposit')} ${amount.value} ${tokenInTarget.value.symbol}`,
      action: {
        label: t('viewTx'),
        onClick: () => {
          window.open(`${targetNetwork.value!.scanUrl}/tx/${tx.hash}`, '_blank');
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
    :title="t('deposit')"
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
            :precision="2"
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
              :src="selectNetwork.icon"
              :alt="selectNetwork.name"
              class="w-[30px] h-[30px] bg-gray-500/50"
            />
            <div>{{ selectNetwork.name }}</div>
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
          :disabled="confirming"
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
