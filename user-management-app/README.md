# 👤 User Management App — TP Tests Unitaires avec Vitest

Projet fullstack **React + Express** sur le thème de la **gestion d'utilisateurs**.
Conçu pour le TP Vitest : chaque fichier source est accompagné de ses tests unitaires.

---

## 📁 Structure du projet

```
user-management-app/
│
├── backend/                          ← Logique métier Express
│   ├── src/
│   │   ├── userValidator.js          ← Validation email, password, téléphone, âge
│   │   ├── userService.js            ← CRUD utilisateurs (in-memory)
│   │   ├── authService.js            ← Auth : hash, token, permissions, session
│   │   └── apiService.js             ← Appels API async (fetch externe)
│   ├── tests/
│   │   ├── userValidator.test.js     ← 25 tests
│   │   ├── userService.test.js       ← 27 tests
│   │   ├── authService.test.js       ← 24 tests
│   │   └── apiService.test.js        ← 17 tests async + mocks
│   └── package.json
│
└── frontend/                         ← Interface React
    ├── src/
    │   └── utils/
    │       ├── userUtils.js          ← Initiales, badge, masquage email, tri, carte
    │       └── formHelpers.js        ← Formulaires : force MDP, validation, nettoyage
    ├── tests/
    │   ├── userUtils.test.js         ← 24 tests
    │   └── formHelpers.test.js       ← 20 tests
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation & Lancement

### 1. Backend

```bash
cd backend
npm install
npm run test             # Lance tous les tests une fois
npm run test:watch       # Mode watch (relance à chaque sauvegarde)
npm run test:coverage    # Tests + rapport de couverture HTML
```

### 2. Frontend

```bash
cd frontend
npm install
npm run test
npm run test:coverage
```

---

## 🧪 Détail des tests par fichier

### Backend — `userValidator.js`
| Fonction           | Cas testés |
|--------------------|-----------|
| `isValidEmail()`    | Format valide, sous-domaine, sans @, vide, null |
| `validatePassword()`| Fort, trop court, sans majuscule, sans chiffre, erreurs cumulées |
| `isValidPhone()`    | Mobile, fixe, +33, espaces, trop court, null |
| `isAdult()`         | 30 ans, 10 ans, exactement 18 ans, veille des 18 ans, date invalide |
| `validateUser()`    | Complet valide, email KO, nom trop court, mineur, erreurs cumulées, null |

### Backend — `userService.js`
| Fonction             | Cas testés |
|----------------------|-----------|
| `createUser()`        | Ajout, rôle par défaut, id auto, email doublon (casse), champs manquants, immutabilité |
| `findUserById()`      | Trouvé, introuvable, erreur tableau |
| `findUserByEmail()`   | Exact, insensible casse, introuvable, non-string |
| `updateUser()`        | Nom, multi-champs, sans effet sur autres, protection id, introuvable |
| `deleteUser()`        | Suppression, sans effet sur autres, introuvable |
| `filterByRole()`      | Users, admins, rôle inexistant, role vide |
| `searchUsers()`       | Nom, email, casse, vide = tous, aucun résultat |

### Backend — `authService.js`
| Fonction                 | Cas testés |
|--------------------------|-----------|
| `formatFullName()`        | Capitalisation, tout majuscule, espaces, champs vides |
| `hashPassword()`          | Différent de l'original, déterministe, sel différent, vide |
| `verifyPassword()`        | Correct, mauvais MDP, sel différent |
| `hasPermission()`         | Admin > tout, moderator > user, user limité, rôle invalide |
| `generateSessionToken()`  | Token non vide, utilisateur invalide |
| `decodeSessionToken()`    | Décodage, encode/décode inverse, vide, malformé |
| `isSessionExpired()`      | Récente, 2h, TTL custom, non-nombre |

### Backend — `apiService.js` *(async + mocks `vi.fn()`)*
| Fonction              | Cas testés |
|-----------------------|-----------|
| `fetchRandomUser()`    | Premier résultat, HTTP 503, bon endpoint |
| `fetchMultipleUsers()` | N résultats, défaut 5, count < 1, count > 100, HTTP 500 |
| `createUserRemote()`   | Création, méthode POST, sans name, sans email, HTTP 500 |
| `fetchUserProfile()`   | Profil trouvé, HTTP 404, id = 0, id négatif, id non-numérique |

### Frontend — `userUtils.js`
| Fonction             | Cas testés |
|----------------------|-----------|
| `getInitials()`       | 2 mots, 1 mot, 3 mots limité à 2, minuscules, espaces, vide, null |
| `getRoleBadgeColor()` | admin, moderator, user, inconnu |
| `formatMemberSince()` | ISO, Date, invalide |
| `maskEmail()`         | Normal, court, 1 char, domaine intact, sans @, null |
| `sortUsersByName()`   | Asc, desc, immutabilité, vide, ordre invalide |
| `buildUserCard()`     | Toutes propriétés, valeurs admin, null |

### Frontend — `formHelpers.js`
| Fonction               | Cas testés |
|------------------------|-----------|
| `passwordsMatch()`      | Identiques, différents, casse, null, deux vides |
| `getPasswordStrength()` | Faible, moyen, fort, très fort, null |
| `sanitizeUserForm()`    | Nettoyage espaces, email lowercase, rôle par défaut, champs vides, null |
| `getFieldError()`       | Champ trouvé, insensible casse, absent, tableau vide, null |
| `isFormReady()`         | Complet valide, nom court, email sans @, MDP court, MDP ≠ confirm, null |

---

## 💡 Concepts du TP illustrés

| Concept                          | Où le trouver |
|----------------------------------|---------------|
| Tests synchrones simples          | Tous les fichiers |
| `toBe` / `toEqual` / `toHaveLength` | `userService`, `userUtils` |
| `toThrow` — tests d'erreur        | Tous les fichiers |
| Boundary testing (valeurs limites)| `userValidator` (`isAdult`), `formHelpers` |
| Tests asynchrones `async/await`   | `apiService.test.js` |
| Mocks avec `vi.fn()`              | `apiService.test.js` |
| `beforeEach` + `vi.restoreAllMocks` | `apiService.test.js` |
| Immutabilité                      | `userService`, `userUtils` |
| Couverture de code `--coverage`   | `npm run test:coverage` |

---

## 📊 Lancer la couverture de code

```bash
npm run test:coverage
# → génère coverage/index.html (ouvrir dans un navigateur)
```

Résultat attendu :

```
───────────────────────────────────────────────────
 File                 | Stmts | Branch | Funcs | Lines
───────────────────────────────────────────────────
 userValidator.js     |  100% |   95%  | 100%  |  100%
 userService.js       |  100% |   90%  | 100%  |  100%
 authService.js       |   98% |   92%  | 100%  |   98%
 apiService.js        |   95% |   90%  | 100%  |   95%
───────────────────────────────────────────────────
```
