export const findMap = <T, U>(
  arr: Array<T>,
  fn: (el: T) => U | undefined
): U | undefined => {
  for (const el of arr) {
    const res = fn(el);
    if (res) return res;
  }
};
