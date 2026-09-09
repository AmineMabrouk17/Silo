export const fmt = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TND";

export const money = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });