import type { Token } from '~/types/common';

export const useTradeStore = defineStore('trade-store', () => {
  const { currentRoute } = useRouter();
  const { usdt, bool } = useNetworkConfig();

  const tokenOptions: {
    value: string;
    label: string;
    tokens: [Token, Token];
  }[] = [
    {
      value: 'BOOL/USDT',
      label: 'BOOL/USDT',
      tokens: [bool, usdt],
    },
    // {
    //   value: "BOOL/USDC",
    //   label: "BOOL/USDC",
    // },
    // {
    //   value: "BOOL/BTU",
    //   label: "BOOL/BTU",
    // },
  ];

  const currantToken = computed(() => {
    const queryToken = currentRoute.value.query?.token as string | undefined;
    return (
      tokenOptions.find(item => item.value === queryToken) ?? tokenOptions[0]!
    );
  });

  return {
    tokenOptions,
    currantToken,
  };
});
