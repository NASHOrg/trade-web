import dayjs from 'dayjs';
import type { ResolutionString } from '~~/public/charting_library/datafeed-api';

const oneMinute = 60;
const oneHour = 60 * oneMinute;
const oneDay = 24 * 60 * oneMinute;

export async function makeApiRequest(path: string) {
  try {
    const url = new URL(`https://testnet.xbit.finance/backend/${path}`);
    const response = await fetch(url.toString());
    return response.json();
  }
  catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}

export function getNextDailyBarTime(barTime: number) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

export async function getAllSymbols() {
  const response = await makeApiRequest('bool-stake-reward/blockchain/pairs');
  const pairs = response.data;
  console.log('tv: [getAllSymbols]: Method call', pairs);
  return pairs.map((pair: any) => ({
    symbol: pair.name,
    full_name: 'XBIT:' + pair.name,
    description: pair.name,
    exchange: 'XBIT',
    type: 'crypto',
  }),
  );
}

export const resolutionInterval = (range: string) => {
  switch (range) {
    case '1D':
      return 2 * oneDay;
    case '60':
      return 4 * oneHour;
    case '1':
      return 5 * oneMinute;
    case '15':
      return 30 * oneMinute;
    case '1M':
      return 150 * oneDay;
  };
};

export const resolutionType = (range: string) => {
  switch (range) {
    case '1D':
      return '1';
    case '60':
      return '0';
    case '1':
      return '3';
    case '15':
      return '4';
    case '1M':
      return '2';
  }
};

export const rangeParams = (range: string) => {
  let now = Math.floor(new Date().getTime() / 1000);
  switch (range) {
    case '1D':
      now = Math.ceil(now / oneDay) * oneDay;
      break;
    case '60':
      now = Math.ceil(now / oneHour) * oneHour;
      break;
    case '1':
      now = Math.ceil(now / oneMinute) * oneMinute;
      break;
    case '15':
      now = Math.ceil(now / (15 * oneMinute)) * (15 * oneMinute);
      break;
    case '1M': {
      const nextMonth = dayjs.unix(now).utc().endOf('month').add(1, 'day').startOf('day');
      now = nextMonth.unix();
      break;
    }
  }
  const intervalValue = resolutionInterval(range);
  if (range === '1M') {
    return {
      start: now * 1000,
      end: (now * 1000).toString(),
    };
  }
  return {
    start: ((now - intervalValue!) * 1000).toString(),
    end: (now * 1000).toString(),
  };
};

export const defaultTradingViewConfig = {
  locale: 'en',
  theme: 'dark',
  container: 'tv-chart-container', // Reference to an attribute of the DOM element
  autosize: true, // Enable auto-sizing
  loading_screen: { backgroundColor: '#121212', foregroundColor: '#f65611' },
  disabled_features: [
    'symbol_search_hot_key',
    'header_quick_search',
    'header_symbol_search',
    'header_compare',
    'header_settings',
    'header_undo_redo',
    'header_saveload',
    'items_favoriting',
    'symbol_search_hot_key',
    'symbol_info',
    'edit_buttons_in_legend',
    'delete_button_in_legend',
    'use_localstorage_for_settings',
    'create_volume_indicator_by_default',
    'popup_hints',
  ],
  enabled_features: ['show_interval_dialog_on_key_press', 'items_favoriting'],
  interval: '1' as ResolutionString, // Default interval
  favorites: {
    intervals: ['1', '15', '1D'],
  },
  allow_symbol_change: false,
  library_path: '/charting_library/',
  toolbar_bg: '#121212',
  custom_css_url: '/tv.css',
  overrides: {
    // Main chart background
    'chart.bg': '#2e2e2e',
    'scalesProperties.background': '#121212',
    'tradingProperties.background': '#121212',
    'tradingProperties.backgroundType': 'solid',

    'paneProperties.background': '#121212',
    'paneProperties.backgroundType': 'solid',
    'paneProperties.separatorColor': '#2e2e2e',

    'paneProperties.vertGridProperties.color': '#2e2e2e',
    'paneProperties.horztGridProperties.color': '#2e2e2e',

    'paneProperties.crossHairProperties.color': '#2e2e2e',

    'scalesProperties.textColor': '#fff',
    'scalesProperties.lineColor': '#2e2e2e',

    'mainSeriesProperties.candleStyle.upColor': '#0AC49E',
    'mainSeriesProperties.candleStyle.downColor': '#e24444',
    'mainSeriesProperties.candleStyle.wickUpColor': '#0AC49E',
    'mainSeriesProperties.candleStyle.wickDownColor': '#e24444',
  },
};
