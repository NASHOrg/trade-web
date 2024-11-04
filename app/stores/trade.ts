export const useTradeStore = defineStore('trade-store', () => {
  const { currentRoute } = useRouter();
  const { usdt, bool } = useNetworkConfig();

  const tokenOptions = computed(() => {
    return [
      {
        value: 'bool-usdt',
        label: 'BOOL / USDT',
        type: 0,
        price: '0.01',
        tokens: [bool, usdt],
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
    const value = currentRoute.value.params?.value as string | undefined;
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
