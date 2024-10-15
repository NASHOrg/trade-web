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
        size: 'md',
      },
      rounded: 'rounded-[4px]',
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
      padding: {
        md: 'px-6 py-2',
      },
    },
    modal: {
      overlay: { background: 'bg-black/60' },
      background: 'bg-[#F7FBFF] dark:bg-[#F7FBFF]',
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
  },
});
