/**
 * Génère les initiales d'un utilisateur pour l'avatar
 * @param {string} name - Nom complet (ex : "Alice Martin")
 * @returns {string} Initiales en majuscules (ex : "AM")
 */
export function getInitials(name) {
  if (typeof name !== "string" || name.trim() === "")
    throw new Error("name doit être une chaîne non vide");
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Retourne la couleur d'un badge selon le rôle
 * @param {"admin"|"moderator"|"user"} role
 * @returns {string} Classe CSS / couleur
 */
export function getRoleBadgeColor(role) {
  const colors = {
    admin:     "red",
    moderator: "orange",
    user:      "blue",
  };
  return colors[role] ?? "gray";
}

/**
 * Formate la date de création d'un compte en français lisible
 * @param {string|Date} date
 * @returns {string} Ex : "01 janvier 2024"
 */
export function formatMemberSince(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) throw new Error("Date invalide");
  return d.toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "long",
    year:  "numeric",
  });
}

/**
 * Masque partiellement un email pour l'affichage (vie privée)
 * Ex : "alice@example.com" → "al***@example.com"
 * @param {string} email
 * @returns {string}
 */
export function maskEmail(email) {
  if (typeof email !== "string" || !email.includes("@"))
    throw new Error("Email invalide");
  const [local, domain] = email.split("@");
  if (local.length < 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

/**
 * Trie une liste d'utilisateurs par nom alphabétique
 * @param {Array}           users
 * @param {"asc"|"desc"}    order
 * @returns {Array} Nouveau tableau trié
 */
export function sortUsersByName(users, order = "asc") {
  if (!Array.isArray(users)) throw new Error("users doit être un tableau");
  if (order !== "asc" && order !== "desc")
    throw new Error("order doit être 'asc' ou 'desc'");
  return [...users].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name, "fr");
    return order === "asc" ? cmp : -cmp;
  });
}

/**
 * Retourne un résumé de l'utilisateur pour l'affichage dans une carte
 * @param {{ name: string, email: string, role: string, createdAt: string }} user
 * @returns {{ initials: string, maskedEmail: string, badge: string, memberSince: string }}
 */
export function buildUserCard(user) {
  if (!user || typeof user !== "object") throw new Error("user invalide");
  return {
    initials:    getInitials(user.name),
    maskedEmail: maskEmail(user.email),
    badge:       getRoleBadgeColor(user.role),
    memberSince: formatMemberSince(user.createdAt),
  };
}