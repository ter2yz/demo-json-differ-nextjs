import { DiffStatus } from "./types";
import { deepCompare, diffChars, tokenize, validateJSON } from "./utils";

describe("tokenize", () => {
  it("should split text into tokens", () => {
    expect(tokenize("hello123")).toEqual(["hello", "123"]);
  });

  it("should handle spaces and punctuation", () => {
    expect(tokenize("hi, world!")).toEqual(["hi", ",", " ", "world", "!"]);
  });
});

describe("diffChars", () => {
  it("should detect added text", () => {
    const result = diffChars("hello", "hello world");
    expect(result.some((r) => r.added)).toBe(true);
  });

  it("should detect removed text", () => {
    const result = diffChars("hello world", "hello");
    expect(result.some((r) => r.removed)).toBe(true);
  });

  it("should show unchanged text", () => {
    const result = diffChars("hello", "hello");
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("hello");
  });
});

describe("deepCompare", () => {
  it("should compare identical objects", () => {
    const obj = { name: "test" };
    const result = deepCompare(obj, obj);
    expect(result.every((r) => r.status === DiffStatus.UNCHANGED)).toBe(true);
  });

  it("should detect differences", () => {
    const result = deepCompare({ a: 1 }, { a: 2 });
    expect(result.some((r) => r.status === DiffStatus.MODIFIED)).toBe(true);
  });
});

describe("validateJSON", () => {
  it("should validate valid JSON", () => {
    const result = validateJSON('{"key": "value"}');
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ key: "value" });
  });

  it("should reject invalid JSON", () => {
    const result = validateJSON("{invalid}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should reject empty input", () => {
    const result = validateJSON("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("JSON cannot be empty");
  });
});
