import { describe, it, expect } from "vitest";
import {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
  filterByRole,
  searchUsers,
} from "../src/userService.js";

// ─── Jeu de données réutilisable ──────────────────────────────────────────────
const baseUsers = [
  { id: 1, name: "Alice Martin", email: "alice@example.com", role: "admin", createdAt: "2024-01-01T00:00:00.000Z" },
  { id: 2, name: "Bob Dupont",   email: "bob@example.com",   role: "user",  createdAt: "2024-02-01T00:00:00.000Z" },
  { id: 3, name: "Clara Petit",  email: "clara@example.com", role: "moderator", createdAt: "2024-03-01T00:00:00.000Z" },
  { id: 4, name: "David Leroy",  email: "david@example.com", role: "user",  createdAt: "2024-04-01T00:00:00.000Z" },
];

// ─── createUser ───────────────────────────────────────────────────────────────
describe("createUser()", () => {
  it("ajoute un utilisateur dans une liste vide", () => {
    const result = createUser([], { name: "Eve", email: "eve@example.com" });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Eve");
    expect(result[0].email).toBe("eve@example.com");
    expect(result[0].role).toBe("user"); // rôle par défaut
  });

  it("attribue le rôle fourni si précisé", () => {
    const result = createUser([], { name: "Admin", email: "admin@example.com", role: "admin" });
    expect(result[0].role).toBe("admin");
  });

  it("génère un id et un createdAt automatiquement", () => {
    const result = createUser([], { name: "Eve", email: "eve@example.com" });
    expect(result[0].id).toBeDefined();
    expect(result[0].createdAt).toBeDefined();
  });

  it("lève une erreur si l'email est déjà utilisé", () => {
    expect(() =>
      createUser(baseUsers, { name: "Alice 2", email: "alice@example.com" })
    ).toThrow("Cet email est déjà utilisé");
  });

  it("est insensible à la casse pour la détection de doublon d'email", () => {
    expect(() =>
      createUser(baseUsers, { name: "Alice 2", email: "ALICE@EXAMPLE.COM" })
    ).toThrow("Cet email est déjà utilisé");
  });

  it("lève une erreur si name ou email est absent", () => {
    expect(() => createUser([], { name: "Eve" })).toThrow("name et email sont obligatoires");
    expect(() => createUser([], { email: "eve@example.com" })).toThrow("name et email sont obligatoires");
  });

  it("ne modifie pas le tableau original (immutabilité)", () => {
    const original = [...baseUsers];
    createUser(baseUsers, { name: "Eve", email: "new@example.com" });
    expect(baseUsers).toEqual(original);
  });
});

// ─── findUserById ─────────────────────────────────────────────────────────────
describe("findUserById()", () => {
  it("retourne l'utilisateur correspondant à l'id", () => {
    const user = findUserById(baseUsers, 2);
    expect(user).toBeDefined();
    expect(user.name).toBe("Bob Dupont");
  });

  it("retourne undefined si l'id n'existe pas", () => {
    expect(findUserById(baseUsers, 999)).toBeUndefined();
  });

  it("lève une erreur si users n'est pas un tableau", () => {
    expect(() => findUserById(null, 1)).toThrow();
  });
});

// ─── findUserByEmail ──────────────────────────────────────────────────────────
describe("findUserByEmail()", () => {
  it("retourne l'utilisateur avec l'email exact", () => {
    const user = findUserByEmail(baseUsers, "clara@example.com");
    expect(user).toBeDefined();
    expect(user.id).toBe(3);
  });

  it("est insensible à la casse", () => {
    const user = findUserByEmail(baseUsers, "BOB@EXAMPLE.COM");
    expect(user).toBeDefined();
    expect(user.name).toBe("Bob Dupont");
  });

  it("retourne undefined pour un email inexistant", () => {
    expect(findUserByEmail(baseUsers, "unknown@example.com")).toBeUndefined();
  });

  it("lève une erreur si email n'est pas une chaîne", () => {
    expect(() => findUserByEmail(baseUsers, null)).toThrow();
  });
});

// ─── updateUser ───────────────────────────────────────────────────────────────
describe("updateUser()", () => {
  it("met à jour le nom d'un utilisateur", () => {
    const result = updateUser(baseUsers, 1, { name: "Alice Dupont" });
    expect(result.find((u) => u.id === 1).name).toBe("Alice Dupont");
  });

  it("met à jour plusieurs champs à la fois", () => {
    const result = updateUser(baseUsers, 2, { name: "Robert", role: "moderator" });
    const updated = result.find((u) => u.id === 2);
    expect(updated.name).toBe("Robert");
    expect(updated.role).toBe("moderator");
  });

  it("ne modifie pas les autres utilisateurs", () => {
    const result = updateUser(baseUsers, 1, { name: "Alice Modifiée" });
    expect(result.find((u) => u.id === 2).name).toBe("Bob Dupont");
  });

  it("ignore les tentatives de modification de l'id", () => {
    const result = updateUser(baseUsers, 1, { id: 999, name: "Alice" });
    expect(result.find((u) => u.id === 1)).toBeDefined();
    expect(result.find((u) => u.id === 999)).toBeUndefined();
  });

  it("lève une erreur si l'utilisateur n'existe pas", () => {
    expect(() => updateUser(baseUsers, 999, { name: "Inconnu" })).toThrow(
      "Utilisateur avec l'id 999 introuvable"
    );
  });
});

// ─── deleteUser ───────────────────────────────────────────────────────────────
describe("deleteUser()", () => {
  it("supprime l'utilisateur avec l'id donné", () => {
    const result = deleteUser(baseUsers, 3);
    expect(result).toHaveLength(3);
    expect(result.find((u) => u.id === 3)).toBeUndefined();
  });

  it("ne modifie pas les autres utilisateurs lors de la suppression", () => {
    const result = deleteUser(baseUsers, 4);
    expect(result.find((u) => u.id === 1)).toBeDefined();
    expect(result.find((u) => u.id === 2)).toBeDefined();
  });

  it("lève une erreur si l'utilisateur n'existe pas", () => {
    expect(() => deleteUser(baseUsers, 42)).toThrow(
      "Utilisateur avec l'id 42 introuvable"
    );
  });
});

// ─── filterByRole ─────────────────────────────────────────────────────────────
describe("filterByRole()", () => {
  it("retourne uniquement les utilisateurs du rôle demandé", () => {
    const users = filterByRole(baseUsers, "user");
    expect(users).toHaveLength(2);
    users.forEach((u) => expect(u.role).toBe("user"));
  });

  it("retourne un tableau vide si aucun utilisateur n'a ce rôle", () => {
    expect(filterByRole(baseUsers, "superadmin")).toEqual([]);
  });

  it("retourne les admins", () => {
    expect(filterByRole(baseUsers, "admin")).toHaveLength(1);
    expect(filterByRole(baseUsers, "admin")[0].name).toBe("Alice Martin");
  });

  it("lève une erreur si role est vide", () => {
    expect(() => filterByRole(baseUsers, "")).toThrow();
  });
});

// ─── searchUsers ──────────────────────────────────────────────────────────────
describe("searchUsers()", () => {
  it("trouve les utilisateurs par nom partiel", () => {
    const result = searchUsers(baseUsers, "alice");
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("alice@example.com");
  });

  it("trouve les utilisateurs par email partiel", () => {
    const result = searchUsers(baseUsers, "bob@");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bob Dupont");
  });

  it("est insensible à la casse", () => {
    expect(searchUsers(baseUsers, "CLARA")).toHaveLength(1);
  });

  it("retourne tous les utilisateurs pour une recherche vide", () => {
    expect(searchUsers(baseUsers, "")).toHaveLength(baseUsers.length);
  });

  it("retourne un tableau vide si aucun résultat", () => {
    expect(searchUsers(baseUsers, "xyz123xyz")).toEqual([]);
  });
});
