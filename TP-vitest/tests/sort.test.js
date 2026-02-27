import { describe, it, expect } from "vitest";
import { trier } from "../src/sort.js";

describe("trier", () => {
  it("retourne un tableau vide pour une entrée vide", () => {
    expect(trier([])).toEqual([]);
  });

  it("retourne le même tableau s'il est déjà trié", () => {
    expect(trier([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it("trie un tableau en ordre inverse", () => {
    expect(trier([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("trie un tableau avec des doublons", () => {
    expect(trier([3, 1, 2, 3, 1])).toEqual([1, 1, 2, 3, 3]);
  });
});
