import { describe, it, expect } from "vitest";
import {
  passwordsMatch,
  getPasswordStrength,
  sanitizeUserForm,
  getFieldError,
  isFormReady,
} from "../src/utils/formHelpers.js";

// ─── passwordsMatch ───────────────────────────────────────────────────────────
describe("passwordsMatch()", () => {
  it("retourne true si les deux mots de passe sont identiques", () => {
    expect(passwordsMatch("Secure42!", "Secure42!")).toBe(true);
  });

  it("retourne false si les mots de passe diffèrent", () => {
    expect(passwordsMatch("Secure42!", "Secure43!")).toBe(false);
  });

  it("est sensible à la casse", () => {
    expect(passwordsMatch("Password1", "password1")).toBe(false);
  });

  it("retourne false si l'un des arguments n'est pas une chaîne", () => {
    expect(passwordsMatch(null, "Secure42!")).toBe(false);
    expect(passwordsMatch("Secure42!", undefined)).toBe(false);
  });

  it("retourne true pour deux chaînes vides identiques", () => {
    expect(passwordsMatch("", "")).toBe(true);
  });
});

// ─── getPasswordStrength ──────────────────────────────────────────────────────
describe("getPasswordStrength()", () => {
  it("retourne 'faible' pour un mot de passe court", () => {
    expect(getPasswordStrength("abc")).toBe("faible");
  });

  it("retourne 'moyen' pour un mot de passe de longueur correcte sans variété", () => {
    expect(getPasswordStrength("abcdefgh")).toBe("moyen");
  });

  it("retourne 'fort' pour un mot de passe avec majuscule et chiffre", () => {
    expect(getPasswordStrength("Secure42")).toBe("fort");
  });

  it("retourne 'très fort' pour un mot de passe long avec caractères spéciaux", () => {
    expect(getPasswordStrength("Secure42!#Long")).toBe("très fort");
  });

  it("retourne 'faible' pour un non-string", () => {
    expect(getPasswordStrength(null)).toBe("faible");
    expect(getPasswordStrength(123)).toBe("faible");
  });
});

// ─── sanitizeUserForm ─────────────────────────────────────────────────────────
describe("sanitizeUserForm()", () => {
  it("nettoie les espaces et met l'email en minuscules", () => {
    const result = sanitizeUserForm({
      name:  "  Alice Martin  ",
      email: "  ALICE@EXAMPLE.COM  ",
      role:  "admin",
    });
    expect(result.name).toBe("Alice Martin");
    expect(result.email).toBe("alice@example.com");
    expect(result.role).toBe("admin");
  });

  it("utilise 'user' comme rôle par défaut si absent", () => {
    const result = sanitizeUserForm({ name: "Bob", email: "bob@example.com" });
    expect(result.role).toBe("user");
  });

  it("retourne des chaînes vides pour les champs absents", () => {
    const result = sanitizeUserForm({});
    expect(result.name).toBe("");
    expect(result.email).toBe("");
  });

  it("lève une erreur si formData n'est pas un objet", () => {
    expect(() => sanitizeUserForm(null)).toThrow("formData invalide");
    expect(() => sanitizeUserForm("données")).toThrow("formData invalide");
  });
});

// ─── getFieldError ────────────────────────────────────────────────────────────
describe("getFieldError()", () => {
  const errors = [
    "Le mot de passe doit contenir au moins 8 caractères",
    "Email invalide",
    "Le nom doit contenir au moins 2 caractères",
  ];

  it("retourne le message d'erreur correspondant au champ", () => {
    expect(getFieldError("email", errors)).toBe("Email invalide");
  });

  it("est insensible à la casse pour le fieldName", () => {
    expect(getFieldError("MOT DE PASSE", errors)).toBe(
      "Le mot de passe doit contenir au moins 8 caractères"
    );
  });

  it("retourne null si aucune erreur ne correspond au champ", () => {
    expect(getFieldError("téléphone", errors)).toBeNull();
  });

  it("retourne null pour un tableau d'erreurs vide", () => {
    expect(getFieldError("email", [])).toBeNull();
  });

  it("retourne null si errors n'est pas un tableau", () => {
    expect(getFieldError("email", null)).toBeNull();
  });
});

// ─── isFormReady ──────────────────────────────────────────────────────────────
describe("isFormReady()", () => {
  const validFields = {
    name:     "Alice Martin",
    email:    "alice@example.com",
    password: "Secure42!",
    confirm:  "Secure42!",
  };

  it("retourne true pour un formulaire complet et valide", () => {
    expect(isFormReady(validFields)).toBe(true);
  });

  it("retourne false si le nom est trop court", () => {
    expect(isFormReady({ ...validFields, name: "A" })).toBe(false);
  });

  it("retourne false si l'email n'a pas de @", () => {
    expect(isFormReady({ ...validFields, email: "invalide" })).toBe(false);
  });

  it("retourne false si le mot de passe est trop court", () => {
    expect(isFormReady({ ...validFields, password: "Ab1", confirm: "Ab1" })).toBe(false);
  });

  it("retourne false si les mots de passe ne correspondent pas", () => {
    expect(isFormReady({ ...validFields, confirm: "AutrePass1" })).toBe(false);
  });

  it("retourne false pour un argument null ou non-objet", () => {
    expect(isFormReady(null)).toBe(false);
    expect(isFormReady("données")).toBe(false);
  });
});
