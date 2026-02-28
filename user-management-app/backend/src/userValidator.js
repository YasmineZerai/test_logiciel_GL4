/**
 * Valide le format d'un email
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valide un mot de passe selon les règles :
 *   - Au moins 8 caractères
 *   - Au moins 1 lettre majuscule
 *   - Au moins 1 chiffre
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string" || password.length < 8)
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  if (typeof password === "string" && !/[A-Z]/.test(password))
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  if (typeof password === "string" && !/[0-9]/.test(password))
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  return { valid: errors.length === 0, errors };
}

/**
 * Valide un numéro de téléphone français (formats : 06XXXXXXXX, +336XXXXXXXX…)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s.\-()]/g, "");
  const regex = /^(\+33|0033|0)[1-9](\d{8})$/;
  return regex.test(cleaned);
}

/**
 * Vérifie si un utilisateur est majeur (≥ 18 ans)
 * @param {string} birthDate - Format YYYY-MM-DD
 * @returns {boolean}
 */
export function isAdult(birthDate) {
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) throw new Error("Date de naissance invalide");
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
}

/**
 * Valide un objet utilisateur complet avant création
 * @param {{ name: string, email: string, password: string, birthDate: string }} user
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateUser(user) {
  const errors = [];
  if (!user || typeof user !== "object") return { valid: false, errors: ["Utilisateur invalide"] };
  if (!user.name || user.name.trim().length < 2)
    errors.push("Le nom doit contenir au moins 2 caractères");
  if (!isValidEmail(user.email))
    errors.push("Email invalide");
  const pwCheck = validatePassword(user.password);
  if (!pwCheck.valid) errors.push(...pwCheck.errors);
  if (user.birthDate) {
    try {
      if (!isAdult(user.birthDate)) errors.push("L'utilisateur doit être majeur");
    } catch {
      errors.push("Date de naissance invalide");
    }
  }
  return { valid: errors.length === 0, errors };
}
