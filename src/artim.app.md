## 📘 Cahier des Charges ARTIM **Artisan Manager**

### 🧠 Application SaaS Web de Gestion pour Producteurs Artisanaux

---

### 🎯 Objectif du projet

Créer une **application SaaS moderne** permettant aux producteurs artisanaux (savon, textile, alimentaire, cosmétique, etc.) de gérer l'ensemble de leur activité : **achats, stock, production, ventes, clients, dettes, dépenses et performance financière**.
L'application doit être **responsive**, **multilingue**, **multi-utilisateur** et **évolutive** pour répondre aux besoins d’un marché large et varié.

---

### 👥 Cibles

* Artisans individuels
* Coopératives ou ateliers à petite échelle
* Entrepreneurs de l'économie informelle
* Petites marques locales

---

### 🔧 Modules Fonctionnels

#### 1. **Authentification & Gestion des Comptes**

* Inscription avec email/mot de passe
* Connexion sécurisée avec **BetterAuth**
* Réinitialisation de mot de passe
* Profil utilisateur : nom, activité, devise, langue
* Multi-tenant (chaque compte = une entreprise/artisan distinct)

#### 2. **Produits**

* Création de fiches produits personnalisées (nom, catégorie, description, unité, prix)
* Définition des composants/matières premières nécessaires à la fabrication
* Gestion des variantes (parfum, format, poids, etc.)

#### 3. **Matières premières**

* Création de fiches d’ingrédients ou composants
* Gestion du stock en unités personnalisables (litres, kg, unités)
* Alerte de stock bas

#### 4. **Achats**

* Enregistrement d’achats (matière, quantité, prix, fournisseur, date)
* Mise à jour automatique du stock

#### 5. **Production**

* Création de lots de production (choix du produit, matières utilisées)
* Calcul automatique du coût par lot
* Mise à jour du stock de produits finis
* Historique des productions

#### 6. **Ventes**

* Vente directe (produit, quantité, prix, client, mode de paiement)
* Vente à crédit (gestion de soldes et échéances)
* Mise à jour automatique du stock
* Historique des ventes

#### 7. **Clients**

* Base clients avec coordonnées et solde
* Paiements partiels et totaux
* Suivi des dettes et relances

#### 8. **Dépenses**

* Ajout de toutes les autres charges : énergie, transport, salaires, loyers, etc.
* Catégorisation des dépenses
* Historique filtrable

#### 9. **Statistiques & Rapports**

* Tableau de bord : ventes, dépenses, bénéfice net
* Classements des produits les plus vendus
* Rapport des dettes clients
* Export PDF ou Excel

#### 10. **Paramètres de compte**

* Langue, devise, thème clair/sombre
* Gestion des utilisateurs (dans un même compte artisan)
* Historique d’activité
* Suppression de compte

---

### 💳 Module SaaS avec Stripe

| Plan         | Description                                    |
| ------------ | ---------------------------------------------- |
| **Gratuit**  | 1 utilisateur, 3 produits, 50 ventes/mois      |
| **Standard** | Jusqu'à 5 utilisateurs, 100 produits           |
| **Pro**      | Utilisateurs illimités, toutes fonctionnalités |

* Intégration **Stripe Checkout** pour paiements mensuels ou annuels
* Gestion automatique des abonnements (webhooks Stripe)
* Blocage de l'accès si abonnement expiré

---

### 🛠 Technologies Recommandées

| Domaine                | Technologie                                          |
| ---------------------- | ---------------------------------------------------- |
| Frontend               | **Next.js** (React)                                  |
| Backend API            | **Next.js API Routes**                               |
| ORM & DB               | **Prisma + PostgreSQL**                              |
| Authentification       | **BetterAuth**                                       |
| UI/Design              | **Ant Design**                                       |
| Paiement SaaS          | **Stripe** (Checkout + Webhooks)                     |
| Stockage & hébergement | **Vercel (frontend)** / **Railway ou Supabase (DB)** |

---

### 📱 Interface utilisateur (UI)

* **Design Ant Design** : tableau de bord, listes, formulaires, tables avec filtres
* **Responsive** : utilisable sur ordinateur, tablette et mobile
* **PWA possible** : installation sur téléphone comme une app

---

### 🕓 Phases de développement

| Étape | Objectif                                        |
| ----- | ----------------------------------------------- |
| 1     | Auth + Produits + Achats + Ventes               |
| 2     | Stock + Production + Clients                    |
| 3     | Dépenses + Statistiques + Rapports              |
| 4     | Intégration SaaS : Stripe, plans, limitations   |
| 5     | Finitions : multilingue, PWA, sauvegarde/export |

---
### artim.app
