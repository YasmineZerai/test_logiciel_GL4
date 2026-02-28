import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchRandomUser,
  fetchMultipleUsers,
  createUserRemote,
  fetchUserProfile,
} from "../src/apiService.js";

// ─── Helper mock fetch ────────────────────────────────────────────────────────
function mockFetch(body, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

// ─── fetchRandomUser ──────────────────────────────────────────────────────────
describe("fetchRandomUser()", () => {
  it("retourne le premier utilisateur du résultat", async () => {
    const fakeUser = {
      name: { first: "Alice", last: "Martin" },
      email: "alice@example.com",
      login: { username: "alice42" },
    };
    mockFetch({ results: [fakeUser] });

    const user = await fetchRandomUser();
    expect(user).toEqual(fakeUser);
    expect(user.name.first).toBe("Alice");
    expect(user.email).toBe("alice@example.com");
  });

  it("lève une erreur si le serveur retourne une erreur HTTP", async () => {
    mockFetch({}, false, 503);
    await expect(fetchRandomUser()).rejects.toThrow("Erreur réseau : HTTP 503");
  });

  it("appelle le bon endpoint", async () => {
    mockFetch({ results: [{ name: {}, email: "" }] });
    await fetchRandomUser();
    expect(fetch).toHaveBeenCalledWith("https://randomuser.me/api/");
  });
});

// ─── fetchMultipleUsers ───────────────────────────────────────────────────────
describe("fetchMultipleUsers()", () => {
  it("retourne un tableau de N utilisateurs", async () => {
    const fakeUsers = [
      { name: { first: "Alice" }, email: "alice@example.com" },
      { name: { first: "Bob" },   email: "bob@example.com" },
      { name: { first: "Clara" }, email: "clara@example.com" },
    ];
    mockFetch({ results: fakeUsers });

    const users = await fetchMultipleUsers(3);
    expect(users).toHaveLength(3);
    expect(users[0].name.first).toBe("Alice");
  });

  it("utilise 5 comme valeur par défaut", async () => {
    mockFetch({ results: new Array(5).fill({ name: {}, email: "" }) });
    await fetchMultipleUsers();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("results=5")
    );
  });

  it("lève une erreur si count est hors plage (< 1)", async () => {
    await expect(fetchMultipleUsers(0)).rejects.toThrow(
      "count doit être un nombre entre 1 et 100"
    );
  });

  it("lève une erreur si count est hors plage (> 100)", async () => {
    await expect(fetchMultipleUsers(101)).rejects.toThrow(
      "count doit être un nombre entre 1 et 100"
    );
  });

  it("lève une erreur si l'API répond avec une erreur", async () => {
    mockFetch({}, false, 500);
    await expect(fetchMultipleUsers(3)).rejects.toThrow("Erreur réseau : HTTP 500");
  });
});

// ─── createUserRemote ─────────────────────────────────────────────────────────
describe("createUserRemote()", () => {
  const validData = { name: "David Leroy", email: "david@example.com", role: "user" };

  it("crée un utilisateur et retourne la réponse de l'API", async () => {
    const fakeResponse = { id: 11, ...validData };
    mockFetch(fakeResponse);

    const result = await createUserRemote(validData);
    expect(result.id).toBe(11);
    expect(result.name).toBe("David Leroy");
  });

  it("appelle fetch avec la méthode POST", async () => {
    mockFetch({ id: 11 });
    await createUserRemote(validData);
    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("lève une erreur si name est absent", async () => {
    await expect(createUserRemote({ email: "david@example.com" })).rejects.toThrow(
      "name et email sont obligatoires"
    );
  });

  it("lève une erreur si email est absent", async () => {
    await expect(createUserRemote({ name: "David" })).rejects.toThrow(
      "name et email sont obligatoires"
    );
  });

  it("lève une erreur si l'API échoue (HTTP 500)", async () => {
    mockFetch({}, false, 500);
    await expect(createUserRemote(validData)).rejects.toThrow(
      "Échec de la création de l'utilisateur"
    );
  });
});

// ─── fetchUserProfile ─────────────────────────────────────────────────────────
describe("fetchUserProfile()", () => {
  it("retourne le profil de l'utilisateur correspondant", async () => {
    const fakeProfile = { id: 3, name: "Clara Petit", email: "clara@example.com" };
    mockFetch(fakeProfile);

    const profile = await fetchUserProfile(3);
    expect(profile.id).toBe(3);
    expect(profile.name).toBe("Clara Petit");
  });

  it("lève une erreur pour un HTTP 404", async () => {
    mockFetch({}, false, 404);
    await expect(fetchUserProfile(999)).rejects.toThrow(
      "Utilisateur introuvable (HTTP 404)"
    );
  });

  it("lève une erreur pour un ID invalide (0 ou négatif)", async () => {
    await expect(fetchUserProfile(0)).rejects.toThrow("ID utilisateur invalide");
    await expect(fetchUserProfile(-5)).rejects.toThrow("ID utilisateur invalide");
  });

  it("lève une erreur pour un ID non numérique", async () => {
    await expect(fetchUserProfile("abc")).rejects.toThrow("ID utilisateur invalide");
  });
});
