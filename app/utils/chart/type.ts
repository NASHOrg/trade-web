import type {
  IChartingLibraryWidget } from 'public/charting_library/charting_library';

// set tvWidget in the global window object
declare global {
  interface Window {
    tvWidget: IChartingLibraryWidget | null | undefined;
  }
}
