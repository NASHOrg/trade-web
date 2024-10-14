<script setup lang="ts">
import InviteStatWindow from '~/blocks/invite/InviteStatWindow.vue';
import InviteFriendsWindow from '~/blocks/invite/InviteFriendsWindow.vue';
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] w-full">
    <InviteStatWindow />
    <InviteFriendsWindow class="mt-[28px]" />
  </div>
</template>
