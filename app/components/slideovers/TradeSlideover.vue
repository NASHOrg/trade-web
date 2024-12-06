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
          <IconClose class="size-[12px]" />
        </div>
      </div>

      <div class="w-full" />
    </div>
  </USlideover>
</template>
