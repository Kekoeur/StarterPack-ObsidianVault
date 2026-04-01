# 🧠 Starter Pack — Obsidian Vault pour Développeurs

> Un vault Obsidian clé en main orienté développeur : journal quotidien, suivi de branches/MR, formations, automatisations Git, standup en 1 clic. Chaque module est activable/désactivable via une page de paramétrage.

## ⚡ Setup en 10 minutes

1. [Installer Obsidian](https://obsidian.md)
2. Créer un nouveau vault
3. Copier le contenu de ce repo dans le vault
4. Suivre le guide d'installation dans [`Documentation Vault.md`](Documentation%20Vault.md)
5. Ouvrir `Vault Settings.md` et activer/désactiver les modules souhaités

## ⚙️ Vault Settings — Page de paramétrage

Le fichier [`Vault Settings.md`](Vault%20Settings.md) est la page d'admin du vault. Elle contient des **toggles Meta Bind** pour activer/désactiver chaque module :

| Module | Ce qu'il contrôle | Par défaut |
|--------|-------------------|------------|
| 🔀 Branches / MR | Sections MR dans Daily/Weekly/Monthly/Quarterly | ✅ ON |
| 📚 Formations | Sections formations + bouton Log Formation | ✅ ON |
| 📅 Monthly | Auto-création des notes mensuelles | ✅ ON |
| 📊 Quarterly | Auto-création des notes trimestrielles | ✅ ON |
| 🧠 Énergie & Focus | Sélecteur énergie + slider focus | ✅ ON |
| 🗣️ Standup Auto | Section standup + bouton copie | ✅ ON |
| 🚀 Projets actifs | Section projets actifs | ✅ ON |
| 📊 Habitudes | Tracker d'habitudes dans le Monthly | ✅ ON |

**Comment ça marche :** les templates utilisent des marqueurs `%%BEGIN_MODULE%%` / `%%END_MODULE%%`. À la création d'une note, Templater lit la config et supprime les blocs des modules désactivés. Pas de popup inutile, pas de section vide.

## 📦 Contenu

```
├── templates/              → 18 templates Obsidian (sections conditionnelles)
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
├── Vault Settings.md       → Page admin : activer/désactiver les modules
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
- Énergie + Focus (sélecteur Meta Bind) — *désactivable*
- Objectifs priorisés MoSCoW (Must / Should / Could)
- Reports automatiques des tâches d'hier
- MR actives en temps réel — *désactivable*
- Formations actives avec barres de progression — *désactivable*
- Standup auto en 1 clic — *désactivable*
- Rétrospective de fin de journée

### Suivi Branches / MR — *désactivable*
- Création interactive (prompts projet → branche → type)
- Statut en 1 clic : LOCAL → MERGE_PENDING → MERGE_REVIEW → DEV → STG → PROD → CLOSED
- Sync des commits depuis le repo local
- Génération de message MR via IA
- Auto-archivage des branches CLOSED > 30 jours

### Suivi Formations — *désactivable*
- Progression multi-axes avec barres visuelles
- Logging en 1 clic depuis le Daily
- Cascade : Daily → Weekly → Monthly → Quarterly

### Agrégation automatique
- Weekly : TIL agrégé, stats énergie/focus/tâches/MR
- Monthly : habitudes, formations terminées — *désactivable*
- Quarterly : OKR avec progression auto, goal cascade — *désactivable*

## 🛠️ Personnalisation

1. Ouvrir `Vault Settings.md` → activer/désactiver les modules avec les toggles
2. Ouvrir `scripts/git-helpers.js` → modifier l'objet `PROJECTS` avec vos projets
3. Mettre à jour les listes de projets dans les templates (`tp.system.suggester`)
4. Configurer votre token GitLab (optionnel) — voir `Documentation Vault.md`

## 🤝 Contribuer

Ce repo est ouvert aux contributions. Si tu utilises ce starter pack et que tu l'améliores, tu peux proposer tes changements.

### Workflow pour contribuer

```bash
# 1. Fork le repo sur GitHub

# 2. Clone ton fork
git clone https://github.com/TON-USER/StarterPack-ObsidianVault.git

# 3. Crée une branche
git checkout -b feat/mon-amelioration

# 4. Fais tes modifications (templates, scripts, docs)

# 5. Commit et push
git add -A
git commit -m "feat: description de l'amélioration"
git push origin feat/mon-amelioration

# 6. Ouvre une Pull Request sur GitHub
```

### Lier le repo à ton vault (junction Windows)

Pour voir le starter pack directement dans ton vault Obsidian et synchroniser facilement :

```powershell
# Supprimer le dossier 08 - Starter Kit s'il existe déjà
Remove-Item "C:\chemin\vers\vault\08 - Starter Kit" -Recurse -Force

# Créer un junction (lien symbolique Windows)
cmd /c mklink /J "C:\chemin\vers\vault\08 - Starter Kit" "C:\chemin\vers\StarterPack-ObsidianVault"
```

Résultat : `08 - Starter Kit/` dans ton vault pointe vers le repo Git. Toute modification dans l'un est visible dans l'autre.

### Récupérer les mises à jour

```bash
# Depuis le dossier du repo
cd C:\chemin\vers\StarterPack-ObsidianVault
git pull
```

Les fichiers sont mis à jour dans ton vault instantanément via le junction.

## 📖 Documentation

- [`Vault Settings.md`](Vault%20Settings.md) — Page admin des modules
- [`Documentation Vault.md`](Documentation%20Vault.md) — Architecture, templates, workflows, raccourcis
- [`Partager le Vault.md`](Partager%20le%20Vault.md) — Guide de partage et contribution

## 📄 Licence

MIT — Utilisez, modifiez, partagez librement.
