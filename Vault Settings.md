---
type: vault-settings
modules:
  branches: true
  formations: true
  monthly: true
  quarterly: true
  yearly: true
  energy: true
  standup: true
  projects: true
  habitudes: true
  progressbar: true
  ultime: true
  routines: true
  activity: true
tags: [config, settings]
---

# ⚙️ Vault Settings

> Active ou désactive les modules du vault. Les templates et requêtes Dataview s'adaptent automatiquement.

---

## 🔧 Modules

### Journal & Périodiques

| Module | Description | Actif |
|--------|-------------|-------|
| 📅 Monthly | Notes mensuelles (objectifs, habitudes, rétro) | `INPUT[toggle:modules.monthly]` |
| 📊 Quarterly | Notes trimestrielles (OKR, goal cascade) | `INPUT[toggle:modules.quarterly]` |
| 📆 Yearly | Notes annuelles (bilan, objectifs long terme) | `INPUT[toggle:modules.yearly]` |

### Sections du Daily

| Module | Description | Actif |
|--------|-------------|-------|
| 🧠 Énergie & Focus | Sélecteur énergie + slider focus | `INPUT[toggle:modules.energy]` |
| 📊 Progression | Barres de progression mois/année dans le Daily | `INPUT[toggle:modules.progressbar]` |
| 🎯 Tâche ultime | LA tâche prioritaire unique de la journée | `INPUT[toggle:modules.ultime]` |
| 🗣️ Standup Auto | Section standup + bouton copie presse-papier | `INPUT[toggle:modules.standup]` |
| 🎮 Routines | Suivi quotidien de hobbies/passions (lecture, sport, etc.) | `INPUT[toggle:modules.routines]` |
| 📝 Activité du jour | Notes modifiées et créées aujourd'hui (Dataview) | `INPUT[toggle:modules.activity]` |

### Fonctionnalités

| Module | Description | Actif |
|--------|-------------|-------|
| 🔀 Branches / MR | Suivi des branches git, statuts, sync, MR board | `INPUT[toggle:modules.branches]` |
| 📚 Formations | Suivi des formations, progression, sessions | `INPUT[toggle:modules.formations]` |
| 🚀 Projets actifs | Section projets actifs dans les notes | `INPUT[toggle:modules.projects]` |
| 📊 Habitudes | Tracker d'habitudes dans le Monthly | `INPUT[toggle:modules.habitudes]` |

---

## 📖 Comment ça marche

Chaque template (Daily, Weekly, Monthly, Quarterly, Yearly) lit cette note au moment de la création via Templater. Les sections correspondant aux modules désactivés ne sont tout simplement pas générées.

### Pour modifier
- Cliquer sur les toggles ci-dessus
- Les prochaines notes créées refléteront les changements

### Modules par défaut
Tout est activé par défaut. Désactive ce que tu n'utilises pas.

---

## 🔗 Utilisé par

- `06 - Templates/Daily.md`
- `06 - Templates/Weekly.md`
- `06 - Templates/Monthly.md`
- `06 - Templates/Quarterly.md`
- `06 - Templates/Yearly.md`
- `00 - Dashboard/Dashboard.md`
- `Home.md`
