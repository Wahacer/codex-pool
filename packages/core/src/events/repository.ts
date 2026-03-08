export interface EventRecord {
  type: string;
  reason: string;
}

export function createEventRepository(seed: EventRecord[] = []) {
  const events = [...seed];

  return {
    record(event: EventRecord) {
      events.unshift(event);
    },
    list() {
      return [...events];
    },
  };
}
