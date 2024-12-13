import { ofetch } from 'ofetch';
import { Yapi } from './yapi';
import { BotApi } from './bot-api';
import { AuthApi } from './auth-api';
import type { ApiProvider } from '~/types/api';

const api = defineNuxtPlugin((nuxtApp) => {
  const { $config } = nuxtApp;
  const { setToken } = useToken();
  const apiProvider: ApiProvider = {
    fetch: ofetch.create({
      baseURL: $config.public.baseUrl as string + '/bool-stake-reward',
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
          throw new Error(response.msg);
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
  const authApiProvider: ApiProvider = {
    fetch: ofetch.create({
      baseURL: $config.public.baseUrl as string + '/bool-basic-backend',
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en-US',
      },
      retry: 3,
      retryDelay: 500,
      parseResponse: (data) => {
        const response = JSON.parse(data);
        if (response.code !== '000') {
          if (response.code === '108.bool-dhc-node-sale.UNAUTHENTICATED') {
            setToken();
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
  return {
    provide: {
      api: new Yapi(apiProvider),
      botApi: new BotApi(botApiProvider),
      authApi: new AuthApi(authApiProvider),
    },
  };
});

export default api;
