import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isAdult,
  validateUser,
} from "../src/userValidator.js";

// ─── isValidEmail ─────────────────────────────────────────────────────────────
describe("isValidEmail()", () => {
  it("valide un email classique", () => {
    expect(isValidEmail("alice@example.com")).toBe(true);
  });

  it("valide un email avec sous-domaine", () => {
    expect(isValidEmail("bob@mail.company.org")).toBe(true);
  });

  it("rejette un email sans @", () => {
    expect(isValidEmail("aliceexample.com")).toBe(false);
  });

  it("rejette un email sans domaine après @", () => {
    expect(isValidEmail("alice@")).toBe(false);
  });

  it("rejette un email avec des espaces", () => {
    expect(isValidEmail("alice @example.com")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("retourne false pour null ou un nombre", () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────
describe("validatePassword()", () => {
  it("valide un mot de passe fort", () => {
    const { valid, errors } = validatePassword("Secure42!");
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("rejette un mot de passe trop court (< 8 chars)", () => {
    const { valid, errors } = validatePassword("Ab1");
    expect(valid).toBe(false);
    expect(errors).toContain("Le mot de passe doit contenir au moins 8 caractères");
  });

  it("rejette un mot de passe sans majuscule", () => {
    const { valid, errors } = validatePassword("password1");
    expect(valid).toBe(false);
    expect(errors).toContain("Le mot de passe doit contenir au moins une majuscule");
  });

  it("rejette un mot de passe sans chiffre", () => {
    const { valid, errors } = validatePassword("PasswordOnly");
    expect(valid).toBe(false);
    expect(errors).toContain("Le mot de passe doit contenir au moins un chiffre");
  });

  it("accumule plusieurs erreurs simultanément", () => {
    const { valid, errors } = validatePassword("abc");
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── isValidPhone ─────────────────────────────────────────────────────────────
describe("isValidPhone()", () => {
  it("valide un numéro mobile français (06XXXXXXXX)", () => {
    expect(isValidPhone("0612345678")).toBe(true);
  });

  it("valide un numéro fixe français (01XXXXXXXX)", () => {
    expect(isValidPhone("0156789012")).toBe(true);
  });

  it("valide un numéro avec préfixe +33", () => {
    expect(isValidPhone("+33612345678")).toBe(true);
  });

  it("valide un numéro avec espaces", () => {
    expect(isValidPhone("06 12 34 56 78")).toBe(true);
  });

  it("rejette un numéro trop court", () => {
    expect(isValidPhone("0612345")).toBe(false);
  });

  it("rejette un numéro commençant par 00", () => {
    expect(isValidPhone("0012345678")).toBe(false);
  });

  it("retourne false pour un non-string", () => {
    expect(isValidPhone(612345678)).toBe(false);
    expect(isValidPhone(null)).toBe(false);
  });
});

// ─── isAdult ──────────────────────────────────────────────────────────────────
describe("isAdult()", () => {
  it("retourne true pour une personne de 30 ans", () => {
    expect(isAdult("1994-06-15")).toBe(true);
  });

  it("retourne false pour un enfant de 10 ans", () => {
    const year = new Date().getFullYear() - 10;
    expect(isAdult(`${year}-06-15`)).toBe(false);
  });

  it("retourne true exactement le jour du 18e anniversaire", () => {
    const today = new Date();
    const y = today.getFullYear() - 18;
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    expect(isAdult(`${y}-${m}-${d}`)).toBe(true);
  });

  it("retourne false la veille du 18e anniversaire", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear() - 18;
    const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const d = String(tomorrow.getDate()).padStart(2, "0");
    expect(isAdult(`${y}-${m}-${d}`)).toBe(false);
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => isAdult("pas-une-date")).toThrow("Date de naissance invalide");
  });
});

// ─── validateUser (intégration des validateurs) ───────────────────────────────
describe("validateUser()", () => {
  const validUser = {
    name: "Alice Martin",
    email: "alice@example.com",
    password: "Secure42!",
    birthDate: "1990-01-01",
  };

  it("valide un utilisateur complet et correct", () => {
    const { valid, errors } = validateUser(validUser);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("rejette un utilisateur avec un email invalide", () => {
    const { valid, errors } = validateUser({ ...validUser, email: "pas-un-email" });
    expect(valid).toBe(false);
    expect(errors).toContain("Email invalide");
  });

  it("rejette un utilisateur avec un nom trop court", () => {
    const { valid, errors } = validateUser({ ...validUser, name: "A" });
    expect(valid).toBe(false);
    expect(errors).toContain("Le nom doit contenir au moins 2 caractères");
  });

  it("rejette un utilisateur mineur", () => {
    const year = new Date().getFullYear() - 16;
    const { valid, errors } = validateUser({ ...validUser, birthDate: `${year}-01-01` });
    expect(valid).toBe(false);
    expect(errors).toContain("L'utilisateur doit être majeur");
  });

  it("accumule toutes les erreurs en une seule passe", () => {
    const { errors } = validateUser({ name: "X", email: "bad", password: "weak" });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });

  it("retourne une erreur si l'argument n'est pas un objet", () => {
    const { valid, errors } = validateUser(null);
    expect(valid).toBe(false);
    expect(errors).toContain("Utilisateur invalide");
  });
});
