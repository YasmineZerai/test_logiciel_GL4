/**
 * Formate le nom complet d'un utilisateur (capitalisation)
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function formatFullName(firstName, lastName) {
  if (!firstName || !lastName) throw new Error("Prénom et nom requis");
  const capitalize = (s) =>
    s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase();
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
}

/**
 * Hache un mot de passe de façon simple (simulation — PAS pour la production !)
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
export function hashPassword(password, salt = "tp_salt") {
  if (typeof password !== "string" || password.length === 0)
    throw new Error("Mot de passe invalide");
  // Simulation d'un hash : en prod on utiliserait bcrypt
  return `${salt}:${Buffer.from(password + salt).toString("base64")}`;
}

/**
 * Vérifie si un mot de passe correspond au hash stocké
 * @param {string} password
 * @param {string} storedHash
 * @param {string} salt
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash, salt = "tp_salt") {
  const expected = hashPassword(password, salt);
  return expected === storedHash;
}

/**
 * Vérifie si un utilisateur a la permission requise
 * Hiérarchie : admin > moderator > user
 * @param {string} userRole
 * @param {string} requiredRole
 * @returns {boolean}
 */
export function hasPermission(userRole, requiredRole) {
  const hierarchy = { admin: 3, moderator: 2, user: 1 };
  if (!(userRole in hierarchy) || !(requiredRole in hierarchy))
    throw new Error("Rôle invalide");
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

/**
 * Génère un token de session simple (simulation)
 * @param {{ id: number, email: string, role: string }} user
 * @returns {string}
 */
export function generateSessionToken(user) {
  if (!user?.id || !user?.email) throw new Error("Utilisateur invalide");
  const payload = JSON.stringify({ id: user.id, email: user.email, role: user.role });
  return Buffer.from(payload).toString("base64");
}

/**
 * Décode un token de session
 * @param {string} token
 * @returns {{ id: number, email: string, role: string }}
 */
export function decodeSessionToken(token) {
  if (typeof token !== "string" || token.length === 0)
    throw new Error("Token invalide");
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    throw new Error("Token malformé");
  }
}

/**
 * Détermine si une session est expirée
 * @param {number} createdAt  - Timestamp de création (ms)
 * @param {number} ttlMs      - Durée de vie en ms (défaut : 1h)
 * @returns {boolean}
 */
export function isSessionExpired(createdAt, ttlMs = 3600 * 1000) {
  if (typeof createdAt !== "number") throw new Error("createdAt doit être un nombre");
  return Date.now() - createdAt > ttlMs;
}
