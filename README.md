# 🧠 Starter Pack — Obsidian Vault pour Développeurs

> Un vault Obsidian clé en main orienté développeur : journal quotidien, suivi de branches/MR, formations, automatisations Git, standup en 1 clic. 13 modules activables/désactivables via une page de paramétrage.

## ⚡ Setup en 10 minutes

### Option 1 : Script d'installation (recommandé)

```bash
# 1. Cloner le repo
git clone https://github.com/Kekoeur/StarterPack-ObsidianVault.git

# 2. Lancer le script d'installation
cd StarterPack-ObsidianVault
node install.js
```

Le script :
- Demande le chemin du vault à créer
- Crée toute la structure de dossiers (PARA + Journal)
- Copie les 19 templates, 7 scripts, Vault Settings, documentation
- Crée un Home.md avec les instructions de démarrage
- Propose de lier le starter pack pour les mises à jour futures

### Option 2 : Installation manuelle

1. [Installer Obsidian](https://obsidian.md)
2. Créer un nouveau vault
3. Copier le contenu de `vault-structure/` dans le vault
4. Copier `templates/` dans `06 - Templates/`
5. Copier `scripts/` dans `07 - Config/scripts/`
6. Copier `Vault Settings.md` dans `07 - Config/`
7. Suivre le guide dans [`Documentation Vault.md`](Documentation%20Vault.md)

## 🔄 Mises à jour

Quand le starter pack est mis à jour (nouveaux templates, scripts, dossiers) :

```bash
cd StarterPack-ObsidianVault
node update-vault.js
```

Le script :
- Pull les dernières modifications du repo
- Détecte et copie les **nouveaux** templates et scripts
- Détecte et met à jour les templates/scripts **modifiés**
- Crée les **nouveaux dossiers** ajoutés à la structure
- **Ne touche jamais** au Vault Settings (tes toggles sont préservés)
- Met à jour la documentation

## ⚙️ Vault Settings — Page de paramétrage

Le fichier [`Vault Settings.md`](Vault%20Settings.md) contient des **toggles Meta Bind** pour 13 modules :

| Module | Ce qu'il contrôle | Par défaut |
|--------|-------------------|------------|
| 🔀 Branches / MR | Sections MR dans Daily/Weekly/Monthly/Quarterly | ✅ ON |
| 📚 Formations | Sections formations + bouton Log Formation | ✅ ON |
| 📅 Monthly | Auto-création des notes mensuelles | ✅ ON |
| 📊 Quarterly | Auto-création des notes trimestrielles | ✅ ON |
| 📆 Yearly | Auto-création des notes annuelles | ✅ ON |
| 🧠 Énergie & Focus | Sélecteur énergie + slider focus | ✅ ON |
| 📊 Progression | Barres de progression mois/année | ✅ ON |
| 🎯 Tâche ultime | LA tâche prioritaire unique du jour | ✅ ON |
| 🗣️ Standup Auto | Section standup + bouton copie | ✅ ON |
| 🎮 Routines | Suivi quotidien hobbies/passions | ✅ ON |
| 📝 Activité du jour | Notes modifiées/créées (Dataview) | ✅ ON |
| 🚀 Projets actifs | Section projets actifs | ✅ ON |
| 📊 Habitudes | Tracker d'habitudes dans le Monthly | ✅ ON |

## 📦 Contenu

```
├── install.js              → Script d'installation cross-platform (Node.js)
├── update-vault.js         → Script de mise à jour cross-platform (Node.js)
├── vault-structure/        → Structure de dossiers PARA + Journal
│   ├── 00 - Dashboard/
│   ├── 01 - Projects/ (Pro + Perso)
│   ├── 02 - Areas/ (Pro/Meetings, Pro/1on1, Perso)
│   ├── 03 - Resources/ (Contacts, Reading List, Skills)
│   ├── 04 - Journal/ (Daily, Weekly, Monthly, Quarterly, Yearly)
│   ├── 05 - Archive/, 05 - Tasks/
│   ├── 06 - Templates/
│   └── 07 - Config/ (scripts, cache)
├── templates/              → 19 templates Obsidian (sections conditionnelles)
│   ├── Daily.md            → Note quotidienne (progression, ultime, MoSCoW, routines, standup, activité)
│   ├── Weekly.md           → Agrégation hebdomadaire (TIL, stats, formations)
│   ├── Monthly.md          → Objectifs mensuels + habitudes + formations
│   ├── Quarterly.md        → OKR trimestriels + goal cascade + formations
│   ├── Yearly.md           → Bilan annuel + objectifs long terme
│   ├── Branch.md           → Suivi branche git (boutons statut 1 clic)
│   ├── Formation.md        → Suivi formation (progression multi-axes)
│   ├── Meeting.md, 1on1.md, Sprint.md, Incident.md
│   ├── MR-Review.md, GitLab Issue.md, Error-Entry.md
│   ├── Contact.md, Reading-Note.md, Project-Dashboard.md
│   └── Release.md, Environment.md
├── scripts/                → 7 scripts QuickAdd
│   ├── git-helpers.js      → Module partagé (config projets — À ADAPTER)
│   ├── import-gitlab-issue.js, sync-branch.js, generate-mr-message.js
│   ├── standup-clipboard.js, auto-archive.js, log-formation.js
├── config/
│   └── obsidian-settings.json → Config plugins de référence
├── Vault Settings.md       → Page admin : 13 modules activables
├── Documentation Vault.md  → Documentation complète du système
└── Partager le Vault.md    → Guide de partage et contribution
```

## 🔌 Plugins requis

### Critiques
- **Templater** — Templates dynamiques avec JavaScript
- **Dataview** — Requêtes dynamiques dans les notes
- **Meta Bind** — Boutons one-click, toggles, champs éditables inline

### Importants
- **QuickAdd** — Macros pour les scripts
- **Buttons** — Boutons dans les notes
- **MetaEdit** — Édition rapide du frontmatter
- **Tasks** — Gestion avancée des tâches
- **Calendar** — Panneau calendrier

### Confort
- **Homepage** — Page d'accueil au lancement
- **Heatmap Calendar** — Heatmap d'activité
- **Table Editor** — Édition tableaux
- **Obsidian Git** — Synchronisation Git

## 🎯 Fonctionnalités principales

### Daily Note
- Barres de progression mois/année — *désactivable*
- Énergie + Focus (sélecteur Meta Bind) — *désactivable*
- Tâche ultime du jour (UNE seule priorité) — *désactivable*
- Objectifs priorisés MoSCoW (Must / Should / Could)
- Reports automatiques des tâches d'hier
- MR actives en temps réel — *désactivable*
- Formations actives avec barres de progression — *désactivable*
- Routines du jour (lecture, sport, hobbies) — *désactivable*
- Standup auto en 1 clic — *désactivable*
- Rétrospective de fin de journée
- Activité du jour (notes modifiées/créées) — *désactivable*

### Suivi Branches / MR — *désactivable*
- Création interactive (prompts projet → branche → type)
- Statut en 1 clic : LOCAL → MERGE_PENDING → MERGE_REVIEW → DEV → STG → PROD → CLOSED
- Sync des commits, génération message MR via IA, auto-archivage

### Suivi Formations — *désactivable*
- Progression multi-axes avec barres visuelles
- Logging en 1 clic depuis le Daily
- Cascade : Daily → Weekly → Monthly → Quarterly → Yearly

### Agrégation automatique
- Weekly : TIL agrégé, stats énergie/focus/tâches/MR
- Monthly : habitudes, formations terminées — *désactivable*
- Quarterly : OKR avec progression auto, goal cascade — *désactivable*
- Yearly : bilan annuel, stats globales — *désactivable*

## 🛠️ Personnalisation

1. Ouvrir `Vault Settings.md` → activer/désactiver les 13 modules
2. Ouvrir `scripts/git-helpers.js` → modifier l'objet `PROJECTS`
3. Mettre à jour les listes de projets dans les templates (`tp.system.suggester`)
4. Configurer votre token GitLab (optionnel)

## 🤝 Contribuer

```bash
# Fork + clone
git clone https://github.com/TON-USER/StarterPack-ObsidianVault.git
git checkout -b feat/mon-amelioration

# Modifier templates, scripts, docs, vault-structure...
git add -A && git commit -m "feat: description" && git push

# Ouvrir une Pull Request sur GitHub
```

Les utilisateurs récupèrent les changements avec `update-vault.bat`.

## 📖 Documentation

- [`Vault Settings.md`](Vault%20Settings.md) — Page admin des 13 modules
- [`Documentation Vault.md`](Documentation%20Vault.md) — Architecture, templates, workflows, raccourcis
- [`Partager le Vault.md`](Partager%20le%20Vault.md) — Guide de partage et contribution

## 📄 Licence

MIT — Utilisez, modifiez, partagez librement.
