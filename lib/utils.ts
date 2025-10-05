import { DiffChars, DiffLine, DiffStatus } from "./types";

// Tokenize string into words based on boundaries
export const tokenize = (str: string): string[] => {
  const tokens: string[] = [];
  let current = "";
  let lastType = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    let currentType = "";

    if (/[a-zA-Z]/.test(char)) {
      currentType = "letter";
    } else if (/[0-9]/.test(char)) {
      currentType = "number";
    } else if (/\s/.test(char)) {
      currentType = "space";
    } else {
      currentType = "punctuation";
    }

    // Start new token if type changes
    if (lastType && lastType !== currentType) {
      tokens.push(current);
      current = char;
    } else {
      current += char;
    }

    lastType = currentType;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
};

// Simple word-based diff using dynamic programming
export const diffChars = (oldStr: string, newStr: string): DiffChars => {
  const oldTokens = tokenize(oldStr);
  const newTokens = tokenize(newStr);

  const m = oldTokens.length;
  const n = newTokens.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Fill the DP table
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  // Backtrack to find the diff
  const result: DiffChars = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      result.unshift({ value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
      result.unshift({ value: newTokens[j - 1], added: true });
      j--;
    } else if (i > 0) {
      result.unshift({ value: oldTokens[i - 1], removed: true });
      i--;
    }
  }

  // Merge consecutive same-type changes
  const merged: DiffChars = [];
  for (const part of result) {
    const last = merged[merged.length - 1];
    if (last && last.added === part.added && last.removed === part.removed) {
      last.value += part.value;
    } else {
      merged.push({ ...part });
    }
  }

  return merged;
};

export const deepCompare = (obj1: any, obj2: any): DiffLine[] => {
  try {
    const str1 = JSON.stringify(obj1, null, 2);
    const str2 = JSON.stringify(obj2, null, 2);

    const lines1 = str1.split("\n");
    const lines2 = str2.split("\n");

    return diffLines(lines1, lines2);
  } catch (error) {
    console.error("Error in deepCompare:", error);
    return []; // Return empty array instead of undefined
  }
};

// Add this new helper function for line-level diffing
const diffLines = (lines1: string[], lines2: string[]): DiffLine[] => {
  const result: DiffLine[] = [];
  const m = lines1.length;
  const n = lines2.length;

  // Handle empty arrays
  if (m === 0 && n === 0) return [];

  // Build edit graph using dynamic programming
  const dp: {
    cost: number;
    op: "match" | "insert" | "delete" | "replace";
  }[][] = Array(m + 1)
    .fill(0)
    .map(() =>
      Array(n + 1)
        .fill(0)
        .map(() => ({ cost: 0, op: "match" as const }))
    );

  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = { cost: i, op: "delete" };
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = { cost: j, op: "insert" };
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = { cost: dp[i - 1][j - 1].cost, op: "match" };
      } else {
        const deleteCost = dp[i - 1][j].cost + 1;
        const insertCost = dp[i][j - 1].cost + 1;
        const replaceCost = dp[i - 1][j - 1].cost + 1;

        if (deleteCost <= insertCost && deleteCost <= replaceCost) {
          dp[i][j] = { cost: deleteCost, op: "delete" };
        } else if (insertCost <= replaceCost) {
          dp[i][j] = { cost: insertCost, op: "insert" };
        } else {
          dp[i][j] = { cost: replaceCost, op: "replace" };
        }
      }
    }
  }

  // Backtrack to build diff
  let i = m,
    j = n;
  const ops: Array<{ op: string; left?: string; right?: string }> = [];

  while (i > 0 || j > 0) {
    const current = dp[i][j];

    if (current.op === "match" && i > 0 && j > 0) {
      ops.unshift({ op: "match", left: lines1[i - 1], right: lines2[j - 1] });
      i--;
      j--;
    } else if (current.op === "delete" && i > 0) {
      ops.unshift({ op: "delete", left: lines1[i - 1] });
      i--;
    } else if (current.op === "insert" && j > 0) {
      ops.unshift({ op: "insert", right: lines2[j - 1] });
      j--;
    } else if (current.op === "replace" && i > 0 && j > 0) {
      ops.unshift({ op: "replace", left: lines1[i - 1], right: lines2[j - 1] });
      i--;
      j--;
    } else {
      break; // Safety exit
    }
  }

  // Convert ops to DiffLines
  let leftNum = 1;
  let rightNum = 1;

  for (const { op, left, right } of ops) {
    if (op === "match") {
      result.push({
        leftNumber: leftNum++,
        rightNumber: rightNum++,
        left: left || "",
        right: right || "",
        status: DiffStatus.UNCHANGED,
      });
    } else if (op === "delete") {
      result.push({
        leftNumber: leftNum++,
        rightNumber: null,
        left: left || "",
        right: "",
        status: DiffStatus.REMOVED,
      });
    } else if (op === "insert") {
      result.push({
        leftNumber: null,
        rightNumber: rightNum++,
        left: "",
        right: right || "",
        status: DiffStatus.ADDED,
      });
    } else if (op === "replace") {
      result.push({
        leftNumber: leftNum++,
        rightNumber: rightNum++,
        left: left || "",
        right: right || "",
        status: DiffStatus.MODIFIED,
      });
    }
  }

  return result;
};
