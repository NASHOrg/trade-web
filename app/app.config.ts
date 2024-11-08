export const walletConfig = {
  projectId: '07556f4c9346cbd23fa53dde19889e99',
  metadata: {
    name: 'XBIT',
    description: 'The first Decentralized, On-Chain Order Book Exchange with Bool DHC for Self-Custody.',
    url: 'https://xbit.finance',
    icons: ['https://xbit.finance/favicon.png'],
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
        size: 'md',
      },
      rounded: 'rounded-full',
      variant: {
        solid: '!text-white ring-[1px] ring-inset ring-white/10',
      },
      color: {
        white: {
          solid: 'text-[#333] bg-white dark:bg-white dark:text-[#333]',
        },
        sell: {
          solid:
            'shadow-sm ring-1 ring-inset ring-sell-300 dark:ring-sell-700 text-white bg-sell-400 hover:bg-sell-500 disabled:bg-gray-700 aria-disabled:bg-white dark:disabled:bg-gray-700 dark:aria-disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-sell-500 dark:focus-visible:ring-sell-400',
        },
        buy: {
          solid:
            'shadow-sm ring-1 ring-inset ring-buy-300 dark:ring-buy-700 text-white bg-buy-400 hover:bg-buy-500 disabled:bg-gray-700 aria-disabled:bg-white  dark:disabled:bg-gray-700 dark:aria-disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-buy-500 dark:focus-visible:ring-pbuy-400',
        },
      },
      size: {
        '2xs': 'text-base',
        'xs': 'text-base',
        'sm': 'text-sm',
        'md': 'text-[20px]',
        'lg': 'text-lg',
        'xl': 'text-xl',
      },
      padding: {
        md: 'p-[12px]',
      },
    },
    modal: {
      overlay: {
        background: 'bg-black/60',
      },
      background: 'bg-[#F7FBFF] dark:bg-[#f7fbff]',
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
      base: '!bg-transparent rounded-lg text-nowrap',
      divide: '!divide-none',
      th: {
        base: 'text-center first:text-left',
        color: 'text-gray-500 dark:text-[#999]',
        size: 'text-xs font-normal',
        padding: 'py-1.5',
      },
      td: {
        base: 'text-center first:text-left',
        color: 'text-white',
        size: 'text-sm leading-4 font-normal',
        padding: 'py-[15px]',
      },
    },
    progress: {
      progress: {
        base: 'block border border-solid border-primary dark:border-primary overflow-hidden',
        width: 'w-full [&::-webkit-progress-bar]:w-full',
        size: { md: 'h-2.5', xs: 'h-[6px]' },
        rounded: 'rounded-full [&::-webkit-progress-bar]:rounded-full',
        track:
          '[&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-bar]:dark:bg-transparent [@supports(selector(&::-moz-progress-bar))]:bg-transparent [@supports(selector(&::-moz-progress-bar))]:bg-transparent',
        bar: '[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-full',
        color: 'text-primary dark:text-primary',
        background:
          '[&::-webkit-progress-value]:bg-current [&::-moz-progress-bar]:bg-current',
        indeterminate: {
          base: 'indeterminate:relative',
          rounded:
            'indeterminate:after:rounded-full [&:indeterminate::-webkit-progress-value]:rounded-full [&:indeterminate::-moz-progress-bar]:rounded-full',
        },
      },
    },
    toggle: {
      base: 'order-[1px] border-none',
      size: {
        md: ' h-[18px] w-[34px]',
      },
      active: 'bg-primary-500 dark:bg-primary-500',
      inactive: 'bg-[#999999] dark:bg-[#999999]',
      container: {
        base: 'bg-white dark:bg-white border-none',
        size: {
          md: 'h-[18px] w-[18px]',
        },
      },
    },
  },
});
