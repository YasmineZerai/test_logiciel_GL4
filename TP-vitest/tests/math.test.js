import { describe, it, expect } from "vitest";
import { add } from "../src/math.js";

describe("add", () => {
  it("additionne deux nombres positifs", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("additionne deux nombres négatifs", () => {
    expect(add(-4, -6)).toBe(-10);
  });

  it("additionne avec zéro", () => {
    expect(add(0, 0)).toBe(0);
    expect(add(5, 0)).toBe(5);
    expect(add(0, 7)).toBe(7);
  });

  it("additionne de grands nombres", () => {
    expect(add(1000000, 2000000)).toBe(3000000);
  });
});
