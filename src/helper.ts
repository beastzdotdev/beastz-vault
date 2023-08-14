export function fields<T>(): { [P in keyof T]: P } {
  return new Proxy(
    {},
    {
      get: function (_: object, prop: string | symbol): string | symbol {
        return prop;
      },
    }
  ) as {
    [P in keyof T]: P;
  };
}

export function redirect(url: string) {
  window.location.href = url;
}
