export const useTradeStore = defineStore('trade-store', () => {
  const { currentRoute } = useRouter();
  const { tokens } = useNetworkConfig();

  const tokenOptions = computed(() => {
    return [
      {
        value: 'bool-usdt',
        label: 'BOOL / USDT',
        type: 0,
        price: '0.01',
        tokens: [tokens.value.bool, tokens.value.usdt],
      },
      // {
      //   value: "BOOL/USDC",
      //   label: "BOOL/USDC",
      //   type: 0,
      //   price: "0.01",
      //   tokens: [bool, usdt],
      // },
    ];
  });

  const currantToken = computed(() => {
    const value = currentRoute.value.query?.value as string | undefined;
    return (
      tokenOptions.value.find(item => item.value === value)
      ?? tokenOptions.value[0]
    );
  });

  return {
    tokenOptions,
    currantToken,
  };
});
