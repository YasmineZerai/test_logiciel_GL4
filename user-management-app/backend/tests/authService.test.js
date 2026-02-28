import { describe, it, expect } from "vitest";
import {
  formatFullName,
  hashPassword,
  verifyPassword,
  hasPermission,
  generateSessionToken,
  decodeSessionToken,
  isSessionExpired,
} from "../src/authService.js";

// ─── formatFullName ───────────────────────────────────────────────────────────
describe("formatFullName()", () => {
  it("capitalise correctement prénom et nom", () => {
    expect(formatFullName("john", "doe")).toBe("John Doe");
  });

  it("normalise un nom entièrement en majuscules", () => {
    expect(formatFullName("ALICE", "MARTIN")).toBe("Alice Martin");
  });

  it("normalise un nom en minuscules", () => {
    expect(formatFullName("clara", "petit")).toBe("Clara Petit");
  });

  it("supprime les espaces en début et fin", () => {
    expect(formatFullName("  paul  ", "  dupont  ")).toBe("Paul Dupont");
  });

  it("lève une erreur si le prénom est vide", () => {
    expect(() => formatFullName("", "Doe")).toThrow("Prénom et nom requis");
  });

  it("lève une erreur si le nom est absent", () => {
    expect(() => formatFullName("John", "")).toThrow("Prénom et nom requis");
  });
});

// ─── hashPassword & verifyPassword ───────────────────────────────────────────
describe("hashPassword()", () => {
  it("retourne une chaîne différente du mot de passe original", () => {
    const hash = hashPassword("MonMotDePasse1");
    expect(hash).not.toBe("MonMotDePasse1");
  });

  it("retourne toujours le même hash pour le même mot de passe + sel", () => {
    expect(hashPassword("MonMotDePasse1", "sel")).toBe(hashPassword("MonMotDePasse1", "sel"));
  });

  it("retourne un hash différent si le sel change", () => {
    expect(hashPassword("MonMotDePasse1", "sel1")).not.toBe(hashPassword("MonMotDePasse1", "sel2"));
  });

  it("lève une erreur pour un mot de passe vide", () => {
    expect(() => hashPassword("")).toThrow("Mot de passe invalide");
  });
});

describe("verifyPassword()", () => {
  it("retourne true pour un mot de passe correct", () => {
    const hash = hashPassword("Secure42!", "monSel");
    expect(verifyPassword("Secure42!", hash, "monSel")).toBe(true);
  });

  it("retourne false pour un mauvais mot de passe", () => {
    const hash = hashPassword("Secure42!", "monSel");
    expect(verifyPassword("WrongPass1", hash, "monSel")).toBe(false);
  });

  it("retourne false si le sel est différent", () => {
    const hash = hashPassword("Secure42!", "sel1");
    expect(verifyPassword("Secure42!", hash, "sel2")).toBe(false);
  });
});

// ─── hasPermission ────────────────────────────────────────────────────────────
describe("hasPermission()", () => {
  it("admin a accès aux ressources admin", () => {
    expect(hasPermission("admin", "admin")).toBe(true);
  });

  it("admin a accès aux ressources user et moderator", () => {
    expect(hasPermission("admin", "user")).toBe(true);
    expect(hasPermission("admin", "moderator")).toBe(true);
  });

  it("moderator a accès aux ressources user", () => {
    expect(hasPermission("moderator", "user")).toBe(true);
  });

  it("moderator n'a pas accès aux ressources admin", () => {
    expect(hasPermission("moderator", "admin")).toBe(false);
  });

  it("user n'a pas accès aux ressources moderator ou admin", () => {
    expect(hasPermission("user", "moderator")).toBe(false);
    expect(hasPermission("user", "admin")).toBe(false);
  });

  it("lève une erreur pour un rôle inexistant", () => {
    expect(() => hasPermission("superadmin", "user")).toThrow("Rôle invalide");
    expect(() => hasPermission("user", "root")).toThrow("Rôle invalide");
  });
});

// ─── generateSessionToken & decodeSessionToken ────────────────────────────────
describe("generateSessionToken()", () => {
  it("génère un token non vide", () => {
    const token = generateSessionToken({ id: 1, email: "alice@example.com", role: "admin" });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("lève une erreur si l'utilisateur n'a pas d'id ou d'email", () => {
    expect(() => generateSessionToken({ email: "alice@example.com" })).toThrow("Utilisateur invalide");
    expect(() => generateSessionToken({ id: 1 })).toThrow("Utilisateur invalide");
  });
});

describe("decodeSessionToken()", () => {
  it("décode correctement un token généré", () => {
    const user = { id: 42, email: "bob@example.com", role: "user" };
    const token = generateSessionToken(user);
    const decoded = decodeSessionToken(token);
    expect(decoded.id).toBe(42);
    expect(decoded.email).toBe("bob@example.com");
    expect(decoded.role).toBe("user");
  });

  it("encode et décode sont inverses l'un de l'autre", () => {
    const user = { id: 7, email: "clara@example.com", role: "moderator" };
    expect(decodeSessionToken(generateSessionToken(user))).toEqual(user);
  });

  it("lève une erreur pour un token vide", () => {
    expect(() => decodeSessionToken("")).toThrow("Token invalide");
  });

  it("lève une erreur pour un token malformé", () => {
    expect(() => decodeSessionToken("!!!malformed!!!")).toThrow("Token malformé");
  });
});

// ─── isSessionExpired ─────────────────────────────────────────────────────────
describe("isSessionExpired()", () => {
  it("retourne false pour une session créée à l'instant (TTL 1h)", () => {
    expect(isSessionExpired(Date.now())).toBe(false);
  });

  it("retourne true pour une session créée il y a 2h (TTL 1h)", () => {
    const twoHoursAgo = Date.now() - 2 * 3600 * 1000;
    expect(isSessionExpired(twoHoursAgo)).toBe(true);
  });

  it("respecte un TTL personnalisé (5 secondes)", () => {
    const fiveSecondsAgo = Date.now() - 6000;
    expect(isSessionExpired(fiveSecondsAgo, 5000)).toBe(true);
    expect(isSessionExpired(Date.now() - 1000, 5000)).toBe(false);
  });

  it("lève une erreur si createdAt n'est pas un nombre", () => {
    expect(() => isSessionExpired("hier")).toThrow("createdAt doit être un nombre");
  });
});
