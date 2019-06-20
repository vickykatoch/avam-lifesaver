export function memoize(fn: any,  maxCache: number,  cacheKeyResolver?: Function): any {
  const cache = new Map<string, any>();
  return (...args) => {
    const key = cacheKeyResolver
      ? cacheKeyResolver.call(undefined, ...args)
      : JSON.stringify(args);
    if (!cache.has(key)) {
      // tslint:disable-next-line: no-unused-expression
      cache.size >= maxCache && cache.delete(cache.keys().next().value);
      cache.set(key, fn.call(undefined, ...args));
    }
    return cache.get(key);
  };
}
