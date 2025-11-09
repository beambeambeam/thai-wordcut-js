import { describe, expect, it } from "vitest";
import Wordcut from "./wordcut.js";

describe("Wordcut", () => {
  it("should cut Thai text into words", () => {
    const wordcut = Object.create(Wordcut);
    wordcut.initNoDict();

    const text = "สวัสดีครับ";
    const result = wordcut.cut(text);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result).toContain("|");
  });

  it("should handle empty string", () => {
    const wordcut = Object.create(Wordcut);
    wordcut.initNoDict();

    const result = wordcut.cut("");

    expect(result).toBe("");
  });
});
