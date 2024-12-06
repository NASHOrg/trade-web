<script lang="ts" setup>
const { isMD } = useDevice();
const slideover = useSlideover();

function onClose() {
  slideover.close();
}
</script>

<template>
  <USlideover
    :side="isMD ? 'left' : 'bottom'"
    :ui="{
      background: '!bg-black',
    }"
  >
    <div class="w-full max-w-[500px] h-screen">
      <div class="w-full flex justify-between px-4 py-2">
        <div />
        <div
          class="cursor-pointer"
          @click="onClose"
        >
          <IconClose class="size-[12px]" />
        </div>
      </div>
      <TradeTokens @select="onClose" />
    </div>
  </USlideover>
</template>
