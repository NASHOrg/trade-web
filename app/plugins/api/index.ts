import { ofetch } from 'ofetch';
import { Yapi } from './yapi';
import { BotApi } from './bot-api';
import type { ApiProvider } from '~/types/api';

const api = defineNuxtPlugin((nuxtApp) => {
  const { $config } = nuxtApp;
  const apiProvider: ApiProvider = {
    fetch: ofetch.create({
      baseURL: $config.public.baseUrl as string,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en-US',
        // "Authorization": userStore.token ? `Bearer ${userStore.token}` : ''
      },
      retry: 3,
      retryDelay: 500,
      parseResponse: (data) => {
        const response = JSON.parse(data);
        if (response.code !== '000' && response.code !== 200) {
          if (response.code === '108.bool-stake-reward.UNAUTHENTICATED') {
            const userStore = useUserStore();
            userStore.logout();
          }
          else {
            throw new Error(response.msg);
          }
        }
        else {
          return response.data;
        }
      },
    }),
  };
  const botApiProvider: ApiProvider = {
    fetch: ofetch.create({
      baseURL: 'https://miniapp.bool.network/backend/bool-tg-interface',
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en-US',
      },
      retry: 3,
      retryDelay: 500,
      parseResponse: (data) => {
        const response = JSON.parse(data);
        if (response.code !== '000' && response.code !== 200) {
          throw new Error(response.msg);
        }
        else {
          return response.data;
        }
      },
    }),
  };
  return {
    provide: {
      api: new Yapi(apiProvider),
      botApi: new BotApi(botApiProvider),
    },
  };
});

export default api;
