import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface HandoffInput {
  goal: string;
  pendingTodos: string[];
}

export interface HandoffRecord extends HandoffInput {
  prompt: string;
}

export function buildHandoff(input: HandoffInput): HandoffRecord {
  const pendingSection =
    input.pendingTodos.length > 0
      ? `Pending:\n- ${input.pendingTodos.join("\n- ")}`
      : "Pending:\n- none";

  return {
    ...input,
    prompt: `Goal: ${input.goal}\n${pendingSection}`,
  };
}

export async function saveHandoff(filePath: string, input: HandoffInput) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(buildHandoff(input), null, 2));
}
