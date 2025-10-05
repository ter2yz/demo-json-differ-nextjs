export const DiffStatus = {
  ADDED: "added",
  REMOVED: "removed",
  MODIFIED: "modified",
  UNCHANGED: "unchanged",
} as const;

export type DiffStatus = (typeof DiffStatus)[keyof typeof DiffStatus];

export const DiffSide = {
  LEFT: "left",
  RIGHT: "right",
} as const;

export type DiffSide = (typeof DiffSide)[keyof typeof DiffSide];

export type DiffChars = Array<{
  value: string;
  added?: boolean;
  removed?: boolean;
}>;

export type DiffLine = {
  leftNumber: number | null;
  rightNumber: number | null;
  left: string;
  right: string;
  status: DiffStatus;
};

export type PayloadStore = {
  payload1?: any;
  payload2?: any;
};
