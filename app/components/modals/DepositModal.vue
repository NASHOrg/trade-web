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
const { network, bridgeNetworks } = useNetworkConfig();
const { address, chainId, switchNetwork, provider } = useWallet();
const { add } = useBridgeHistory();

const modal = useModal();
const amount = ref('');
const confirming = ref(false);

const selectedNetwork = ref(bridgeNetworks[0]!);

const tokenInTarget = computed(() => {
  return Object.values(selectedNetwork.value.tokens).find(
    (item: Token) => item.symbol === props.token.symbol,
  )!;
});

const networkOptions = computed(() => {
  return bridgeNetworks.map((item) => {
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

const { data: balanceInBool } = useAsyncData(
  `deposit-data-network-balance-${props.token.symbol}`,
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
    watch: [address],
  },
);

const { data: balanceInTarget } = useAsyncData(
  `deposit-data-target-balance-${props.token.symbol}`,
  () => {
    if (!selectedNetwork.value || !address.value) {
      return Promise.resolve(BigInt(0));
    }
    const targetApi = new BaseEvmApi(selectedNetwork.value.rpc);
    return targetApi.getBalance({
      address: address.value,
      contractAddress: tokenInTarget.value.address,
    });
  },
  {
    server: false,
    watch: [address],
  },
);

const items = computed(() => {
  const balanceInBoolFormat = ethers.formatUnits(
    balanceInBool.value ?? '0',
    props.token.decimals,
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
        props.token.decimals,
      )} ${props.token.symbol}`,
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
    else if (!selectedNetwork.value) {
      throw new Error('Please select network!');
    }
    else if (!address.value) {
      throw new Error('Wallet is not connected.');
    }
    confirming.value = true;

    // Check wallet network
    if (chainId.value !== selectedNetwork.value.chainId) {
      const result = await switchNetwork(selectedNetwork.value.chainId);
      if (!result) return;
    }

    const bridgeApi = new BridgeApi(
      selectedNetwork.value.rpc,
      selectedNetwork.value.contracts.consumer,
    );

    const amountParse = ethers.parseUnits(
      amount.value,
      tokenInTarget.value.decimals,
    );

    const approveParam = {
      contract: tokenInTarget.value.address,
      approvedAddress: selectedNetwork.value.contracts.consumer,
      address: address.value,
      amount: amountParse,
    };

    const isApproved = await bridgeApi.isApprove(approveParam);

    if (!isApproved) {
      const approveTx = await bridgeApi.approve(provider(), {
        ...approveParam,
        amount: MaxUint256,
      });
      await new Promise((resolve, reject) => {
        toast.promise(bridgeApi.checkTransaction(approveTx.hash), {
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

    const tx = await bridgeApi.bridgeOut(provider(), {
      dstChainId: network.chainId,
      amount: amountParse,
      dstRecipient: address.value!,
      customData: '0x',
    });

    const params: BridgeHistory = {
      swapRecordSrcTokenAmount: amount.value,
      swapRecordDstTokenAmount: amount.value,
      swapRecordSrcChainHash: tx.hash,
      swapRecordSrcChainId: selectedNetwork.value.chainId.toString(),
      swapRecordDstChainId: network.chainId.toString(),
      swapRecordDstUserAddress: address.value ?? '',
      swapRecordSrcChainTime: Date.now().toString(),
      swapRecordSrcTokenName: tokenInTarget.value?.name,
      swapRecordDstTokenName: props.token.name,
      swapRecordDstTokenSymbol: tokenInTarget.value.symbol,
      swapRecordStatus: 'Pending',
    };
    add(params);
    const tokenKey = `token-balance-${address.value}-${tokenInTarget.value.address ?? ''}`;

    toast.promise(bridgeApi.checkTransaction(tx.hash), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData(tokenKey);
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
      description: `${t('deposit')} ${amount.value} ${tokenInTarget.value.symbol}`,
      action: {
        label: t('viewTx'),
        onClick: () => {
          window.open(`${selectedNetwork.value.explorer}/tx/${tx.hash}`, '_blank');
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
