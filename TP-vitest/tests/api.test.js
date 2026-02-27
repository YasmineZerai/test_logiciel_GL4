import { describe, it, expect, vi } from "vitest";
import { fetchRandomUser } from "../src/api.js";

describe("fetchRandomUser", () => {
  it("retourne un utilisateur avec name et email", async () => {
    const fakeUser = {
      name: { first: "John", last: "Doe" },
      email: "john.doe@example.com",
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ results: [fakeUser] }),
    });

    const user = await fetchRandomUser();

    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user.name.first).toBe("John");
    expect(user.email).toBe("john.doe@example.com");
  });
});
