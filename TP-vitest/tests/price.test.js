import { describe, it, expect } from "vitest";
import { isPriceInRange } from "../src/price.js";

describe("isPriceInRange", () => {
  it("retourne true pour le prix égal à min", () => {
    expect(isPriceInRange(10, 10, 50)).toBe(true);
  });

  it("retourne true pour le prix égal à max", () => {
    expect(isPriceInRange(50, 10, 50)).toBe(true);
  });

  it("retourne true pour un prix dans la plage", () => {
    expect(isPriceInRange(30, 10, 50)).toBe(true);
  });

  it("retourne false pour un prix inférieur à min", () => {
    expect(isPriceInRange(5, 10, 50)).toBe(false);
  });

  it("retourne false pour un prix supérieur à max", () => {
    expect(isPriceInRange(55, 10, 50)).toBe(false);
  });

  it("retourne true quand min === max === price", () => {
    expect(isPriceInRange(25, 25, 25)).toBe(true);
  });
});
