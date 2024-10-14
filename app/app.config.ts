export const walletConfig = {
  projectId: '07556f4c9346cbd23fa53dde19889e99',
  metadata: {
    name: 'Bool Bridge Pools',
    description: 'Bool Bridge Pools',
    url: 'https://example.com',
    icons: ['https://exmaple.com/icon.png'],
  },
};

export default defineAppConfig({
  wallet: {
    // Get projectId at https://cloud.walletconnect.com
    projectId: walletConfig.projectId,
  },
  metadata: walletConfig.metadata,
  ui: {
    primary: 'main',
    gray: 'neutral',
    button: {
      default: {
        loadingIcon: 'i-tdesign-loading',
      },
      rounded: 'rounded-[10px]',
      variant: {
        solid: '!text-white ring-[1px] ring-inset ring-white/10',
      },
      size: {
        '2xs': 'text-base',
        'xs': 'text-base',
        'sm': 'text-sm',
        'md': 'text-[16px]',
        'lg': 'text-lg',
        'xl': 'text-xl',
      },
    },
    modal: {
      overlay: {
        background: 'bg-black/60',
      },
      background: '!bg-[#F7FBFF]',
      rounded: 'rounded-[12px]',
      base: 'text-[#333]',
    },
    tabs: {
      list: {
        background: 'bg-gray-200',
        marker: {
          background: 'bg-primary-500 dark:bg-primary-400',
        },
        tab: {
          active: 'text-white',
        },
      },
    },
    table: {
      base: 'bg-white dark:bg-gray-800 rounded-lg',
      th: {
        color: 'text-gray-500 dark:text-gray-400',
      },
    },
  },
});
