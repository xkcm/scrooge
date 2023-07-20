export type Constructor<K, Args extends any[] = any[]> = new (
  ...args: Args
) => K;
