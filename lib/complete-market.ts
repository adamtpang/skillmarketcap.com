/** Never let a transient source outage replace a complete cached market. */
export function requireCompleteMarket<T extends { sourceFailures: string[] }>(snapshot: T): T {
  if (snapshot.sourceFailures.length) {
    throw new Error(`Market refresh incomplete: ${snapshot.sourceFailures.join(', ')}`);
  }
  return snapshot;
}
