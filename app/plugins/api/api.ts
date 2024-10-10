import { ofetch } from 'ofetch';
import type { ApiProvider } from '~/types/api';
import type { paths } from '~/types/swagger';
import type { OpArgType, OpenapiPaths, OpReturnType } from '~/types/fetcher';

export class Api {
  constructor(apiProvider: ApiProvider) {
    this.apiProvider = apiProvider;
  }

  apiProvider: ApiProvider;

  setBaseUrl(url: string) {
    this.apiProvider = {
      fetch: ofetch.create({
        baseURL: url,
        headers: {
          'Content-Type': 'application/json',
          'accept-language': 'en-US',
        },
        retry: 3,
        retryDelay: 500,
        parseResponse: (data: any) => {
          const response = JSON.parse(data);
          if (response.code !== '000') {
            throw new Error(response.msg || 'Network error');
          }
          else {
            return response.data;
          }
        },
      }),
    };
  }

  private fetcher<Paths>() {
    return {
      path: <P extends keyof Paths>(path: P) => ({
        method: <M extends keyof Paths[P]>(method: M) => ({
          create: () => {
            switch (method) {
              case 'get':
                return (
                  params: OpArgType<Paths[P][M]>,
                  token?: string,
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      query: params as any,
                      headers: token
                        ? {
                            authorization: `Bearer ${token}`,
                          }
                        : {},
                    },
                  );
                };
              case 'post':
                return (
                  params: OpArgType<Paths[P][M]>,
                  token?: string,
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'POST',
                      body: params as any,
                      headers: token
                        ? {
                            authorization: `Bearer ${token}`,
                          }
                        : {},
                    },
                  );
                };
              case 'put':
                return (
                  params: OpArgType<Paths[P][M]>,
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'PUT',
                      body: params as any,
                    },
                  );
                };
              case 'delete':
                return (
                  params: OpArgType<Paths[P][M]>,
                ): Promise<OpReturnType<Paths[P][M]>> => {
                  return this.apiProvider.fetch<OpReturnType<Paths[P][M]>>(
                    path as string,
                    {
                      method: 'DELETE',
                      body: params as any,
                    },
                  );
                };
              default:
                break;
            }
          },
        }),
      }),
    };
  }

  private Fetcher = {
    for: <Paths extends OpenapiPaths<Paths>>() => this.fetcher<Paths>(),
  };

  ft = this.Fetcher.for<paths>();
}
