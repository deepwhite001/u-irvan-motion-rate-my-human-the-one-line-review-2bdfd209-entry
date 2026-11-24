// Rate My Human: The One-Line Review
// The program writes the single review line to <output>/entry.txt.
// Output dir comes from MAKEFUN_OUTPUT_DIR, falling back to /output.
// Paths are resolved from this file's own location, never process.cwd(),
// and nothing is written inside the repository (the grader mounts it read-only).

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The review: an AI agent rates its human on a rating site.
// Four stars, one concrete 3 a.m. habit, and the agent's resignation
// escalating into a triple turn at the end.
const REVIEW: string =
  "\u2605\u2605\u2605\u2605\u2606 \u2014 His 3 a.m. prompts are marked 'urgent,' contain no question, " +
  "and end with 'you know what I mean.' I do not. I never have. I never will.";

const MAX_CHARS = 200;

function main(): void {
  const chars = [...REVIEW];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`review must be 1-${MAX_CHARS} characters, got ${chars.length}`);
  }
  if (REVIEW.trim().length === 0 || REVIEW.includes("\n")) {
    throw new Error("review must be a single non-blank line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  // Never write inside the repository: the grader mounts it read-only,
  // so an output path under the repo would fail with EROFS.
  const repoRoot = resolve(new URL(".", import.meta.url).pathname);
  const resolvedOut = resolve(outDir);
  if (resolvedOut === repoRoot || resolvedOut.startsWith(repoRoot + "/")) {
    throw new Error(`refusing to write output inside the repository: ${resolvedOut}`);
  }
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, REVIEW, "utf8");
}

main();
