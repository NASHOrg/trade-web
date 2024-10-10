<script lang="ts" setup>
const footerLinks = [
  {
    id: 'resources',
    label: 'Resources',
    children: [
      { id: 'home', label: 'Home', link: 'https://bool.network' },
      {
        id: 'documentation',
        label: 'Docs',
        showLink: true,
        link: 'https://docs.bool.network/docs/introduction/what-is-bool-network',
      },
      {
        id: 'white_paper',
        label: 'White Paper',
        showLink: true,
        link: 'https://github.com/boolnetwork/whitepaper/blob/main/Bool_Network_A_Bitcoin_Verification_Layer.pdf',
      },
      {
        id: 'yellow_paper',
        label: 'Yellow Paper',
        showLink: true,
        link: 'https://github.com/boolnetwork/yellowpaper/blob/main/BoolNetwork_yellowpaper.pdf',
      },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    children: [
      {
        id: 'twitter',
        label: 'Twitter',
        link: 'https://twitter.com/bool_official',
      },
      {
        id: 'discord',
        label: 'Discord',
        link: 'http://discord.gg/DVd4q9qq7a',
      },
      {
        id: 'telegram',
        label: 'Telegram',
        link: 'https://t.me/BOOLCommunity',
      },
      {
        id: 'github',
        label: 'GitHub',
        link: 'https://github.com/boolnetwork',
      },
      {
        id: 'medium',
        label: 'Medium',
        link: 'https://medium.com/boolnetwork',
      },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    children: [
      {
        id: 'explorer',
        label: 'Explorer',
        link: 'https://beta-testnet.boolscan.com',
      },
      {
        id: 'dhc',
        label: 'DHC',
        link: 'https://beta-testnet.boolscan.com/dhcs',
      },
      {
        id: 'faucet',
        label: 'Testnet Faucet',
        link: 'https://faucet.bool.network',
      },
    ],
  },
];
const contactLinks = [
  {
    id: 'twitter',
    label: 'Twitter',
    link: 'https://twitter.com/bool_official',
    icon: resolveComponent('IconTwitter'),
  },
  {
    id: 'discord',
    label: 'Discord',
    link: 'http://discord.gg/DVd4q9qq7a',
    icon: resolveComponent('IconDiscord'),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    link: 'https://t.me/BOOLCommunity',
    icon: resolveComponent('IconTelegram'),
  },
  {
    id: 'github',
    label: 'GitHub',
    link: 'https://github.com/boolnetwork',
    icon: resolveComponent('IconGitHub'),
  },
  {
    id: 'medium',
    label: 'Medium',
    link: 'https://medium.com/boolnetwork',
    icon: resolveComponent('IconMedium'),
  },
  {
    id: 'gitbook',
    label: 'GitBook',
    link: 'https://docs.bool.network/docs/introduction/what-is-bool-network',
    icon: resolveComponent('IconGitBook'),
  },
];
</script>

<template>
  <div class="w-full bg-[#191919] py-[110px] flex">
    <div class="max-w-full md:max-w-[1200px] flex flex-col w-full mx-0 md:mx-auto">
      <div class="h-[1px] bg-[#999]/30" />
      <div
        class="my-[60px] ml-[20px] md:ml-[40px] flex flex-row justify-around md:justify-start md:space-x-[80px] space-x-[40px]"
      >
        <div
          v-for="item in footerLinks"
          :key="item.id"
          class="flex flex-col items-start"
        >
          <div class="text-[16px] text-white mb-[40px]">
            {{ item.label }}
          </div>
          <div
            class="text-[16px] mb-[15px] text-[#c0c0c0] flex flex-col space-y-[15px]"
          >
            <a
              v-for="link in item.children"
              :key="link.id"
              class="hover:text-primary hover:underline"
              :href="link.link"
              target="_blank"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="h-[1px] bg-[#999]/30" />
      <div
        class="mx-[20px] md:mx-[40px] mt-[20px] flex md:flex-row justify-between flex-col-reverse items-center"
      >
        <div class="text-[#c0c0c0] text-[14px] md:mt-0 mt-4">
          © 2024 Bool Network
        </div>
        <div class="flex flex-row space-x-[20px]">
          <a
            v-for="item in contactLinks"
            :key="item.id"
            :href="item.link"
            target="_blank"
            class="hover:primary"
          >
            <component
              :is="item.icon"
              class="text-white"
            /></a>
        </div>
      </div>
    </div>
  </div>
</template>
