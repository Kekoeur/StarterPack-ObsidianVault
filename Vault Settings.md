---
type: vault-settings
modules:
  branches: true
  formations: true
  monthly: true
  quarterly: true
  energy: true
  standup: true
  projects: true
  habitudes: true
tags: [config, settings]
---

# ⚙️ Vault Settings

> Active ou désactive les modules du vault. Les templates et requêtes Dataview s'adaptent automatiquement.

---

## 🔧 Modules

| Module | Description | Actif |
|--------|-------------|-------|
| 🔀 Branches / MR | Suivi des branches git, statuts, sync, MR board | `INPUT[toggle:modules.branches]` |
| 📚 Formations | Suivi des formations, progression, sessions | `INPUT[toggle:modules.formations]` |
| 📅 Monthly | Notes mensuelles (objectifs, habitudes, rétro) | `INPUT[toggle:modules.monthly]` |
| 📊 Quarterly | Notes trimestrielles (OKR, goal cascade) | `INPUT[toggle:modules.quarterly]` |
| 🧠 Énergie & Focus | Sélecteur énergie + slider focus dans le Daily | `INPUT[toggle:modules.energy]` |
| 🗣️ Standup Auto | Section standup + bouton copie presse-papier | `INPUT[toggle:modules.standup]` |
| 🚀 Projets actifs | Section projets actifs dans les notes | `INPUT[toggle:modules.projects]` |
| 📊 Habitudes | Tracker d'habitudes dans le Monthly | `INPUT[toggle:modules.habitudes]` |

---

## 📖 Comment ça marche

Chaque template (Daily, Weekly, Monthly, Quarterly) lit cette note au moment de la création via Templater. Les sections correspondant aux modules désactivés ne sont tout simplement pas générées.

Les requêtes Dataview dans les notes déjà créées vérifient aussi cette config : si un module est désactivé, la section affiche un message discret ou est masquée.

### Pour modifier
- Cliquer sur les toggles ci-dessus
- Les prochaines notes créées refléteront les changements
- Les notes existantes s'adaptent via Dataview (pour les sections dynamiques)

### Modules par défaut
Tout est activé par défaut. Désactive ce que tu n'utilises pas.

---

## 🔗 Utilisé par

- `06 - Templates/Daily.md`
- `06 - Templates/Weekly.md`
- `06 - Templates/Monthly.md`
- `06 - Templates/Quarterly.md`
- `00 - Dashboard/Dashboard.md`
- `Home.md`
