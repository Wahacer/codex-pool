import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function writeWorkspaceMemory(filePath: string, content: string) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

export async function readWorkspaceMemory(filePath: string) {
  return readFile(filePath, "utf8");
}
