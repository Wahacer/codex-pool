import { parseQuotaSnapshot } from "./parser";

export function collectQuotaFromText(rawText: string) {
  return parseQuotaSnapshot(rawText);
}
