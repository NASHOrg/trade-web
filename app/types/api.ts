import type { $Fetch } from 'ofetch';

type _PageItem<T> = 'items' extends keyof T ? T['items'] : unknown;

export type Item<T> = T extends (infer U)[] ? U : T;
export type PageItem<T> = Item<_PageItem<T>>;

export interface ApiProvider {
  fetch: $Fetch;
}
