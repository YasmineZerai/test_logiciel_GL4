/**
 * Récupère un utilisateur aléatoire depuis l'API randomuser.me
 * @returns {Promise<Object>} Données du premier utilisateur
 */
export async function fetchRandomUser() {
  const response = await fetch("https://randomuser.me/api/");
  if (!response.ok)
    throw new Error(`Erreur réseau : HTTP ${response.status}`);
  const data = await response.json();
  return data.results[0];
}

/**
 * Récupère une liste de N utilisateurs aléatoires
 * @param {number} count - Nombre d'utilisateurs (1-100)
 * @returns {Promise<Array>}
 */
export async function fetchMultipleUsers(count = 5) {
  if (typeof count !== "number" || count < 1 || count > 100)
    throw new Error("count doit être un nombre entre 1 et 100");
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  if (!response.ok)
    throw new Error(`Erreur réseau : HTTP ${response.status}`);
  const data = await response.json();
  return data.results;
}

/**
 * Simule la création d'un utilisateur via une API REST
 * @param {{ name: string, email: string, role: string }} userData
 * @returns {Promise<Object>} Utilisateur créé avec un id
 */
export async function createUserRemote(userData) {
  if (!userData?.name || !userData?.email)
    throw new Error("name et email sont obligatoires");
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok)
    throw new Error("Échec de la création de l'utilisateur");
  return await response.json();
}

/**
 * Récupère le profil d'un utilisateur par son ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function fetchUserProfile(id) {
  if (typeof id !== "number" || id <= 0)
    throw new Error("ID utilisateur invalide");
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!response.ok)
    throw new Error(`Utilisateur introuvable (HTTP ${response.status})`);
  return await response.json();
}
