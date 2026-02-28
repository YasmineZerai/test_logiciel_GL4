import { describe, it, expect } from "vitest";
import {
  getInitials,
  getRoleBadgeColor,
  formatMemberSince,
  maskEmail,
  sortUsersByName,
  buildUserCard,
} from "../src/utils/userUtils.js";

// ─── getInitials ──────────────────────────────────────────────────────────────
describe("getInitials()", () => {
  it("retourne les initiales de prénom et nom", () => {
    expect(getInitials("Alice Martin")).toBe("AM");
  });

  it("retourne seulement la première initiale pour un prénom seul", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("est limité à 2 initiales même pour 3 mots", () => {
    expect(getInitials("Jean Pierre Dupont")).toBe("JP");
  });

  it("retourne les initiales en majuscules même pour un nom en minuscules", () => {
    expect(getInitials("alice martin")).toBe("AM");
  });

  it("ignore les espaces multiples", () => {
    expect(getInitials("  Bob   Dupont  ")).toBe("BD");
  });

  it("lève une erreur pour une chaîne vide", () => {
    expect(() => getInitials("")).toThrow("name doit être une chaîne non vide");
  });

  it("lève une erreur pour un non-string", () => {
    expect(() => getInitials(null)).toThrow();
    expect(() => getInitials(42)).toThrow();
  });
});

// ─── getRoleBadgeColor ────────────────────────────────────────────────────────
describe("getRoleBadgeColor()", () => {
  it("retourne 'red' pour admin", () => {
    expect(getRoleBadgeColor("admin")).toBe("red");
  });

  it("retourne 'orange' pour moderator", () => {
    expect(getRoleBadgeColor("moderator")).toBe("orange");
  });

  it("retourne 'blue' pour user", () => {
    expect(getRoleBadgeColor("user")).toBe("blue");
  });

  it("retourne 'gray' pour un rôle inconnu", () => {
    expect(getRoleBadgeColor("superadmin")).toBe("gray");
    expect(getRoleBadgeColor("")).toBe("gray");
    expect(getRoleBadgeColor(undefined)).toBe("gray");
  });
});

// ─── formatMemberSince ────────────────────────────────────────────────────────
describe("formatMemberSince()", () => {
  it("formate une date ISO en français", () => {
    const result = formatMemberSince("2024-01-15");
    expect(result).toContain("2024");
    expect(result).toContain("janvier");
    expect(result).toContain("15");
  });

  it("formate un objet Date", () => {
    const result = formatMemberSince(new Date("2023-12-01"));
    expect(result).toContain("2023");
    expect(result).toContain("décembre");
  });

  it("lève une erreur pour une date invalide", () => {
    expect(() => formatMemberSince("pas-une-date")).toThrow("Date invalide");
  });
});

// ─── maskEmail ────────────────────────────────────────────────────────────────
describe("maskEmail()", () => {
  it("masque les caractères du local après les 2 premiers", () => {
    expect(maskEmail("alice@example.com")).toBe("al***@example.com");
  });

  it("masque correctement un email court", () => {
    expect(maskEmail("ab@example.com")).toBe("ab***@example.com");
  });

  it("gère un local d'un seul caractère", () => {
    expect(maskEmail("a@example.com")).toBe("a***@example.com");
  });

  it("conserve le domaine intact", () => {
    const result = maskEmail("bob@my-company.fr");
    expect(result).toContain("@my-company.fr");
  });

  it("lève une erreur pour un email sans @", () => {
    expect(() => maskEmail("invalide")).toThrow("Email invalide");
  });

  it("lève une erreur pour un non-string", () => {
    expect(() => maskEmail(null)).toThrow("Email invalide");
  });
});

// ─── sortUsersByName ──────────────────────────────────────────────────────────
describe("sortUsersByName()", () => {
  const users = [
    { id: 3, name: "Clara Petit",  role: "moderator" },
    { id: 1, name: "Alice Martin", role: "admin" },
    { id: 4, name: "David Leroy",  role: "user" },
    { id: 2, name: "Bob Dupont",   role: "user" },
  ];

  it("trie par ordre alphabétique croissant (asc)", () => {
    const sorted = sortUsersByName(users);
    expect(sorted[0].name).toBe("Alice Martin");
    expect(sorted[3].name).toBe("David Leroy");
  });

  it("trie par ordre alphabétique décroissant (desc)", () => {
    const sorted = sortUsersByName(users, "desc");
    expect(sorted[0].name).toBe("David Leroy");
    expect(sorted[3].name).toBe("Alice Martin");
  });

  it("ne modifie pas le tableau original (immutabilité)", () => {
    const original = [...users];
    sortUsersByName(users);
    expect(users).toEqual(original);
  });

  it("retourne un tableau vide pour une liste vide", () => {
    expect(sortUsersByName([])).toEqual([]);
  });

  it("lève une erreur pour un ordre invalide", () => {
    expect(() => sortUsersByName(users, "random")).toThrow();
  });
});

// ─── buildUserCard ────────────────────────────────────────────────────────────
describe("buildUserCard()", () => {
  const user = {
    name:      "Alice Martin",
    email:     "alice@example.com",
    role:      "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  it("retourne toutes les propriétés attendues", () => {
    const card = buildUserCard(user);
    expect(card).toHaveProperty("initials");
    expect(card).toHaveProperty("maskedEmail");
    expect(card).toHaveProperty("badge");
    expect(card).toHaveProperty("memberSince");
  });

  it("calcule les bonnes valeurs pour un admin", () => {
    const card = buildUserCard(user);
    expect(card.initials).toBe("AM");
    expect(card.maskedEmail).toBe("al***@example.com");
    expect(card.badge).toBe("red");
    expect(card.memberSince).toContain("2024");
  });

  it("lève une erreur pour un utilisateur null", () => {
    expect(() => buildUserCard(null)).toThrow("user invalide");
  });
});
