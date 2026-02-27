import { describe, it, expect } from "vitest";
import { transformer } from "../src/strings.js";

describe("transformer", () => {
  it("retourne une chaîne vide pour une entrée vide", () => {
    expect(transformer("")).toBe("");
  });

  it("convertit les minuscules en majuscules", () => {
    expect(transformer("hello world")).toBe("HELLO WORLD");
  });

  it("gère les caractères spéciaux et les chiffres", () => {
    expect(transformer("abc-123!@#")).toBe("ABC-123!@#");
  });
});
