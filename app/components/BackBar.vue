<script lang="ts" setup>
defineProps<{
  title?: string;
}>();

const router = useRouter();
const back = () => {
  if (router.options.history.state.back) {
    router.back();
  }
  else {
    router.replace('/');
  }
};
</script>

<template>
  <div
    class="flex items-center space-x-2.5 py-2.5 cursor-pointer "
    @click="back"
  >
    <UIcon
      name="i-ic-outline-arrow-back"
      class="w-5 h-5"
    />
    <p class="text-xl font-semibold">
      {{ title ?? "" }}
    </p>
  </div>
</template>
