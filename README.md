# 🧠 Starter Pack — Obsidian Vault pour Développeurs

> Un vault Obsidian clé en main orienté développeur : journal quotidien, suivi de branches/MR, formations, automatisations Git, standup en 1 clic.

## ⚡ Setup en 10 minutes

1. [Installer Obsidian](https://obsidian.md)
2. Créer un nouveau vault
3. Copier le contenu de ce repo dans le vault
4. Suivre le guide d'installation dans [`Documentation Vault.md`](Documentation%20Vault.md)

## 📦 Contenu

```
├── templates/              → 18 templates Obsidian
│   ├── Daily.md            → Note quotidienne (énergie, MoSCoW, formations, standup, rétro)
│   ├── Weekly.md           → Agrégation hebdomadaire (TIL, stats, formations)
│   ├── Monthly.md          → Objectifs mensuels + habitudes + formations
│   ├── Quarterly.md        → OKR trimestriels + goal cascade + formations
│   ├── Branch.md           → Suivi branche git (boutons statut 1 clic)
│   ├── Formation.md        → Suivi formation (progression multi-axes)
│   ├── Meeting.md          → Notes de réunion
│   ├── 1on1.md             → Notes 1:1 manager
│   ├── MR-Review.md        → Documentation reviews reçues
│   ├── GitLab Issue.md     → Documentation issue GitLab
│   ├── Sprint.md           → Wrapper de sprint
│   ├── Incident.md         → Postmortem
│   ├── Error-Entry.md      → Catalogue d'erreurs
│   ├── Contact.md          → Fiche contact
│   ├── Reading-Note.md     → Fiche de lecture
│   ├── Project-Dashboard.md → Dashboard projet
│   ├── Release.md          → Notes de release
│   └── Environment.md      → Documentation environnement
├── scripts/                → 7 scripts QuickAdd
│   ├── git-helpers.js      → Module partagé (config projets — À ADAPTER)
│   ├── import-gitlab-issue.js → Import issue depuis URL GitLab
│   ├── sync-branch.js      → Sync commits git dans la note
│   ├── generate-mr-message.js → Prompt IA pour message MR
│   ├── standup-clipboard.js → Standup formaté → presse-papier
│   ├── auto-archive.js     → Archive branches CLOSED > 30 jours
│   └── log-formation.js    → Met à jour progression formation + log daily
├── config/
│   └── obsidian-settings.json → Config plugins de référence
├── Documentation Vault.md  → Documentation complète du système
└── Partager le Vault.md    → Guide de partage (Git, Publish, Export)
```

## 🔌 Plugins requis

### Critiques
- **Templater** — Templates dynamiques avec JavaScript
- **Dataview** — Requêtes dynamiques dans les notes
- **Meta Bind** — Boutons one-click et champs éditables inline

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
- Énergie + Focus (sélecteur Meta Bind)
- Objectifs priorisés MoSCoW (Must / Should / Could)
- Reports automatiques des tâches d'hier
- MR actives en temps réel
- Formations actives avec barres de progression
- Standup auto en 1 clic (copié dans le presse-papier)
- Rétrospective de fin de journée

### Suivi Branches / MR
- Création interactive (prompts projet → branche → type)
- Statut en 1 clic : LOCAL → MERGE_PENDING → MERGE_REVIEW → DEV → STG → PROD → CLOSED
- Sync des commits depuis le repo local
- Génération de message MR via IA
- Auto-archivage des branches CLOSED > 30 jours

### Suivi Formations
- Progression multi-axes avec barres visuelles
- Logging en 1 clic depuis le Daily
- Cascade : Daily → Weekly → Monthly → Quarterly

### Agrégation automatique
- Weekly : TIL agrégé, stats énergie/focus/tâches/MR
- Monthly : habitudes, formations terminées
- Quarterly : OKR avec progression auto, goal cascade

## 🛠️ Personnalisation

1. Ouvrir `scripts/git-helpers.js` → modifier l'objet `PROJECTS` avec vos projets
2. Mettre à jour les listes de projets dans les templates (`tp.system.suggester`)
3. Configurer votre token GitLab (optionnel) — voir `Documentation Vault.md`

## 📖 Documentation

- [`Documentation Vault.md`](Documentation%20Vault.md) — Architecture, templates, workflows, raccourcis
- [`Partager le Vault.md`](Partager%20le%20Vault.md) — Guide de partage (Git, Publish, Export)

## 📄 Licence

MIT — Utilisez, modifiez, partagez librement.
