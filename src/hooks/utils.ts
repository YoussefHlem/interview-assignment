export function createOptimisticId() {
  const uuid = globalThis.crypto?.randomUUID?.();

  return `optimistic-${uuid ?? Math.random().toString(36).slice(2)}`;
}
