import { ofetch } from 'ofetch';
import { Yapi } from './yapi';
import type { ApiProvider } from '~/types/api';

const api = defineNuxtPlugin((nuxtApp) => {
  const { $config } = nuxtApp;
  const apiProvider: ApiProvider = {
    fetch: ofetch.create({
      baseURL: $config.public.baseUrl as string,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en-US',
      },
      retry: 3,
      retryDelay: 500,
      parseResponse: (data) => {
        const response = JSON.parse(data);
        if (response.code !== '000') {
          if (response.code === '108.bool-reward.UNAUTHENTICATED') {
            // userStore().logout()
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
      yapi: new Yapi(apiProvider),
    },
  };
});

export default api;
