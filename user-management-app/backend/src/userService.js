/**
 * Crée un nouvel utilisateur dans la liste
 * @param {Array}  users   - Liste actuelle des utilisateurs
 * @param {Object} newUser - { name, email, role }
 * @returns {Array} Nouvelle liste avec l'utilisateur ajouté
 */
export function createUser(users, newUser) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  if (!newUser?.name || !newUser?.email)
    throw new Error("name et email sont obligatoires");
  const emailExists = users.some(
    (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
  );
  if (emailExists) throw new Error("Cet email est déjà utilisé");
  const user = {
    id: Date.now(),
    name: newUser.name.trim(),
    email: newUser.email.trim().toLowerCase(),
    role: newUser.role ?? "user",
    createdAt: new Date().toISOString(),
  };
  return [...users, user];
}

/**
 * Trouve un utilisateur par son ID
 * @param {Array}        users
 * @param {number|string} id
 * @returns {Object|undefined}
 */
export function findUserById(users, id) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  return users.find((u) => u.id === id);
}

/**
 * Trouve un utilisateur par son email
 * @param {Array}  users
 * @param {string} email
 * @returns {Object|undefined}
 */
export function findUserByEmail(users, email) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  if (typeof email !== "string") throw new Error("email doit être une chaîne");
  return users.find((u) => u.email === email.toLowerCase().trim());
}

/**
 * Met à jour les champs d'un utilisateur existant
 * @param {Array}        users
 * @param {number|string} id
 * @param {Object}       updates - Champs à modifier
 * @returns {Array} Nouvelle liste mise à jour
 */
export function updateUser(users, id, updates) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  const exists = users.find((u) => u.id === id);
  if (!exists) throw new Error(`Utilisateur avec l'id ${id} introuvable`);
  // Empêcher la modification de l'id et du createdAt
  const { id: _id, createdAt: _ca, ...safeUpdates } = updates;
  return users.map((u) => (u.id === id ? { ...u, ...safeUpdates } : u));
}

/**
 * Supprime un utilisateur par son ID
 * @param {Array}        users
 * @param {number|string} id
 * @returns {Array} Nouvelle liste sans l'utilisateur supprimé
 */
export function deleteUser(users, id) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  const exists = users.find((u) => u.id === id);
  if (!exists) throw new Error(`Utilisateur avec l'id ${id} introuvable`);
  return users.filter((u) => u.id !== id);
}

/**
 * Filtre les utilisateurs par rôle
 * @param {Array}  users
 * @param {string} role  - "admin" | "user" | "moderator"
 * @returns {Array}
 */
export function filterByRole(users, role) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  if (!role || typeof role !== "string") throw new Error("role doit être une chaîne");
  return users.filter((u) => u.role === role);
}

/**
 * Recherche des utilisateurs par nom (insensible à la casse)
 * @param {Array}  users
 * @param {string} query
 * @returns {Array}
 */
export function searchUsers(users, query) {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  if (typeof query !== "string") throw new Error("query doit être une chaîne");
  if (query.trim() === "") return [...users];
  const q = query.toLowerCase();
  return users.filter(
    (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );
}
