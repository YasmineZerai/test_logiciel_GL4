/**
 * Vérifie que deux mots de passe correspondent (confirmation)
 * @param {string} password
 * @param {string} confirm
 * @returns {boolean}
 */
export function passwordsMatch(password, confirm) {
  return typeof password === "string" &&
    typeof confirm === "string" &&
    password === confirm;
}

/**
 * Calcule la force d'un mot de passe
 * @param {string} password
 * @returns {"faible"|"moyen"|"fort"|"très fort"}
 */
export function getPasswordStrength(password) {
  if (typeof password !== "string") return "faible";
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score === 0) return "faible";
  if (score === 1) return "moyen";
  if (score === 3) return "fort";
  return "très fort";
}

/**
 * Nettoie et normalise les données d'un formulaire utilisateur
 * @param {{ name?: string, email?: string, role?: string }} formData
 * @returns {Object} Données nettoyées
 */
export function sanitizeUserForm(formData) {
  if (!formData || typeof formData !== "object")
    throw new Error("formData invalide");
  return {
    name:  formData.name  ? formData.name.trim()             : "",
    email: formData.email ? formData.email.trim().toLowerCase() : "",
    role:  formData.role  ? formData.role.trim()              : "user",
  };
}

/**
 * Construit le message d'erreur à afficher sous un champ de formulaire
 * @param {string} fieldName
 * @param {string[]} errors
 * @returns {string|null}
 */
export function getFieldError(fieldName, errors) {
  if (!Array.isArray(errors)) return null;
  const match = errors.find((e) =>
    e.toLowerCase().includes(fieldName.toLowerCase())
  );
  return match ?? null;
}

/**
 * Vérifie si un formulaire d'inscription est prêt à être soumis
 * @param {{ name: string, email: string, password: string, confirm: string }} fields
 * @returns {boolean}
 */
export function isFormReady(fields) {
  if (!fields || typeof fields !== "object") return false;
  return (
    fields.name?.trim().length >= 2 &&
    fields.email?.includes("@") &&
    fields.password?.length >= 8 &&
    fields.password === fields.confirm
  );
}