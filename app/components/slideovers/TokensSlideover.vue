<script lang="ts" setup>
const slideover = useSlideover();

function onClose() {
  slideover.close();
}
</script>

<template>
  <USlideover
    side="left"
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
          <IconClose class="w-5 h-5" />
        </div>
      </div>
      <TradeTokens @select="onClose" />
    </div>
  </USlideover>
</template>
