# 🎓 Jury LMD - Plateforme de Délibérations (Next.js)

**Application web moderne pour automatiser les jurys universitaires**  
_Gestion des notes, délibérations et procès-verbaux dans le système LMD/ECTS._

---

## ✨ Fonctionnalités
- **📤 Import des notes**  
  Upload de fichiers CSV/Excel ou connexion aux APIs des SI académiques.
- **🧮 Calculs automatiques**  
  Moyennes, compensations, mentions (selon règles LMD).
- **📄 Génération de PV**  
  Export PDF/Excel avec templates modifiables.
- **👨‍🏫 Interface collaborative**  
  Espaces séparés pour enseignants, responsables et administrateurs.
- **🔄 Sync ECTS**  
  Conversion automatique notes/lettres/crédits.

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js v18+
- PostgreSQL (ou SQLite pour le dev)

### Installation
```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/jury-nextjs.git

# 2. Installer les dépendances
cd jury-nextjs
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Puis éditer les variables (DB, API keys...)

# 4. Lancer le dev
npm run dev