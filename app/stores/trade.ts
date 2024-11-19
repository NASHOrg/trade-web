export const useTradeStore = defineStore('trade-store', () => {
  const { currentRoute } = useRouter();
  const { tokens, payToken } = useNetworkConfig();

  const tokenOptions = computed(() => {
    const bu = [tokens.value.bool!, payToken];
    return [
      {
        value: `BOOL/${payToken.symbol}`,
        label: bu.map(item => item!.symbol).join(' / '),
        type: 0,
        price: '0.01',
        tokens: bu,
      },
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
