<script setup lang="ts">
import type { BridgeHistory } from '~/types/common';

const props = defineProps<{
  record: BridgeHistory;
}>();
const { network } = useNetworkConfig();
const chains = network.value.bridge.usdt;
const { counter, pause } = useInterval(1000, { controls: true });
const timeString = ref('');
watch(counter, () => {
  if (props.record.swapRecordStatus === 'Pending' && props.record.swapRecordSrcChainTime) {
    timeString.value = secondsToTimeString(
      Math.floor((Date.now() - Number(props.record.swapRecordSrcChainTime)) / 1000),
    );
  }
  if (
    props.record.swapRecordStatus === 'Success'
    && props.record.swapRecordSrcChainTime
    && props.record.swapRecordDstChainTime
  ) {
    pause();
    timeString.value = secondsToTimeString(
      Math.abs(Number(props.record.swapRecordSrcChainTime) - Number(props.record.swapRecordDstChainTime))
      / 1000,
    );
  }
});

const icons = computed(() => {
  if (Number(props.record.swapRecordSrcChainId) === chains[0].chainId) {
    return {
      from: chains[0].icon,
      to: chains[1].icon,
    };
  }
  else {
    return {
      from: chains[1].icon,
      to: chains[0].icon,
    };
  }
});

function openExplorer(type: 'src' | 'dst') {
  const hash = type === 'src' ? props.record.swapRecordSrcChainHash : props.record.swapRecordDstChainHash;
  const chainId = type === 'src' ? props.record.swapRecordSrcChainId : props.record.swapRecordDstChainId;
  console.log(hash, chainId);
  if (Number(chainId) === chains[0].chainId) {
    window.open(`${chains[0].explorer}/tx/${hash}`, '_blank');
  }
  else if (Number(chainId) === chains[1].chainId) {
    window.open(`${chains[1].explorer}/tx/${hash}`, '_blank');
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="inline-flex justify-between">
      <span class="text-[#999]">{{ formatDate(record.swapRecordSrcChainTime) }}</span>
      <span class="inline-flex items-center space-x-[4px]">
        <span class="text-[#999]">{{ timeString }}</span>
        <span v-if="record.swapRecordStatus === 'Success'">
          <IconCheckCircleOutlinedGreen />
        </span>
      </span>
    </div>
    <div class="mt-[10px] grid grid-cols-[1fr_60px_1fr] px-[16px] py-[20px] border border-[#2e2e2e] rounded-[8px] bg-[#0E0E11]">
      <div class="flex items-center space-x-[8px]">
        <UAvatar
          size="md"
          :ui="{ size: { md: 'size-[40px]' } }"
          :src="icons.from"
        />
        <div class="flex flex-col space-y-[4px]">
          <span class="text-[#333] dark:text-white ">
            {{ Number(record.swapRecordSrcTokenAmount) }} {{ record.swapRecordSrcTokenName }}
          </span>
          <span
            class="text-[#999] text-[12px] cursor-pointer"
            @click="openExplorer('src')"
          >
            {{ shortAddress(record.swapRecordSrcChainHash) }}
          </span>
        </div>
      </div>
      <div class="rounded-full bg-[#333] dark:bg-white text-white dark:text-[#171717] size-[30px] my-auto flex items-center justify-center">
        <IconSwapArraw class="-rotate-90 h-[12px]" />
      </div>
      <div class="flex items-center space-x-[8px]">
        <UAvatar
          size="md"
          :ui="{ size: { md: 'size-[40px]' } }"
          :src="icons.to"
        />
        <div class="flex flex-col space-y-[4px]">
          <span class="text-[#333] dark:text-white ">
            {{ Number(record.swapRecordDstTokenAmount) }} {{ record.swapRecordDstTokenName }}
          </span>
          <span
            class="text-[#999] text-[12px] cursor-pointer"
            @click="openExplorer('dst')"
          >{{ shortAddress(record.swapRecordDstChainHash) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
