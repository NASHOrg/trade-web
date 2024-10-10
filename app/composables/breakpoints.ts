import { useBreakpoints } from '@vueuse/core';
import { _screens } from '#tailwind-config/theme';

export function useDevice() {
  const breakpoints = useBreakpoints(_screens);

  const isSM = computed(() => {
    return breakpoints.sm.value;
  });

  const isMD = computed(() => {
    return breakpoints.md.value;
  });
  const isLG = computed(() => {
    return breakpoints.lg.value;
  });
  const isXL = computed(() => {
    return breakpoints.xl.value;
  });
  return {
    isSM,
    isMD,
    isLG,
    isXL,
  };
}
