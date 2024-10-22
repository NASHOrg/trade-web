<script setup lang="ts">
import FriendsList from '~/blocks/invite/FriendsList.vue';

const { refreshUser } = useUserStore();
refreshUser();
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] w-full">
    <InviteStat />
    <FriendsList class="mt-[28px]" />
  </div>
</template>
