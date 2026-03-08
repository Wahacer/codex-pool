export interface QuotaSnapshot {
  rawText: string;
  fiveHourRemainingPercent: number | null;
  weeklyStatus: string | null;
  quality: "official" | "unknown";
  collectedAt: string;
}

const FIVE_HOUR_PATTERNS = [
  /5-hour usage limit\s+(\d+)% remaining/i,
  /5-hour.*?(\d+)% remaining/i,
];

export function parseQuotaSnapshot(input: string): QuotaSnapshot {
  const fiveHourRemainingPercent = extractFiveHourRemainingPercent(input);

  return {
    rawText: input,
    fiveHourRemainingPercent,
    weeklyStatus: extractWeeklyStatus(input),
    quality: fiveHourRemainingPercent === null ? "unknown" : "official",
    collectedAt: new Date().toISOString(),
  };
}

function extractFiveHourRemainingPercent(input: string) {
  for (const pattern of FIVE_HOUR_PATTERNS) {
    const match = input.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
}

function extractWeeklyStatus(input: string) {
  const weeklyLine = input
    .split("\n")
    .find((line) => /week|weekly/i.test(line));

  return weeklyLine?.trim() ?? null;
}
