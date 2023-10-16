export interface SendApiRequestResult<T> {
  body: T;
  response: Awaited<ReturnType<typeof fetch>>;
}

export interface SendApiRequestOptions {
  path: string;
  body?: object;
  query?: URLSearchParams;
  method?: string;
  ignoreBadStatusCode?: boolean;
  expectEmptyBody?: boolean;
}
