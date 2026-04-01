---
type: doc
tags: [doc, guide]
---

# 📖 Documentation du Vault — Developer Second Brain

> Guide complet du workflow Obsidian pour développeur. Ce document sert à la fois de référence personnelle et de support de présentation.

---

## 🎯 Philosophie

Ce vault est un **Second Brain** orienté développeur qui centralise :
- Le **journal quotidien** avec suivi d'énergie, objectifs priorisés, formations et rétrospective
- Le **suivi des branches/MR** avec changement de statut en un clic
- Le **suivi des formations** avec progression multi-axes et logging automatique
- La **documentation automatique** des modifications via IA + git
- La **capture de connaissances** (TIL, décisions, erreurs, snippets)
- Le **suivi de projets** Pro et Perso avec OKR trimestriels

**Principe clé** : tout ce qui peut être automatisé l'est. Le reste se fait en un clic maximum.

---

## ⚙️ Vault Settings — Modules activables

Le fichier `Vault Settings.md` (à placer dans `07 - Config/`) est la page d'admin du vault. Elle contient des **toggles Meta Bind** pour activer/désactiver chaque module :

| Module | Ce qu'il contrôle | Par défaut |
|--------|-------------------|------------|
| 📅 Monthly | Auto-création des notes mensuelles | ✅ ON |
| 📊 Quarterly | Auto-création des notes trimestrielles | ✅ ON |
| 📆 Yearly | Auto-création des notes annuelles (bilan) | ✅ ON |
| 🧠 Énergie & Focus | Sélecteur énergie + slider focus | ✅ ON |
| 📊 Progression | Barres de progression mois/année dans le Daily | ✅ ON |
| 🎯 Tâche ultime | LA tâche prioritaire unique de la journée | ✅ ON |
| 🗣️ Standup Auto | Section standup + bouton copie presse-papier | ✅ ON |
| 🎮 Routines | Suivi quotidien de hobbies/passions (lecture, sport) | ✅ ON |
| 📝 Activité du jour | Notes modifiées et créées aujourd'hui | ✅ ON |
| 🔀 Branches / MR | Suivi des branches git, statuts, sync, MR board | ✅ ON |
| 📚 Formations | Sections formations + bouton Log Formation | ✅ ON |
| 🚀 Projets actifs | Section projets actifs dans les notes | ✅ ON |
| 📊 Habitudes | Tracker d'habitudes dans le Monthly | ✅ ON |

### Comment ça marche

Les templates (Daily, Weekly, Monthly, Quarterly, Yearly) utilisent des marqueurs `%%BEGIN_MODULE%%` / `%%END_MODULE%%` autour de chaque section optionnelle. À la création d'une note :
1. Templater lit le frontmatter de `Vault Settings.md`
2. Pour chaque module désactivé, le bloc correspondant est supprimé du fichier généré
3. Les marqueurs restants sont nettoyés

Résultat : pas de popup inutile, pas de section vide. Chaque utilisateur choisit ce qu'il veut.

### Pour modifier
- Ouvrir `07 - Config/Vault Settings.md`
- Cliquer sur les toggles
- Les prochaines notes créées refléteront les changements

---

## 🗂️ Architecture du Vault

```
Vault/
├── 00 - Dashboard/          → Pages d'accueil (Dashboard + Home)
├── 01 - Projects/           → Projets Pro & Perso avec branches, MR, features
│   ├── Pro/                 → Projets professionnels
│   └── Perso/               → Projets personnels
├── 02 - Areas/              → Domaines de responsabilité (Meetings, 1on1, Sprints, Formations)
├── 03 - Resources/          → Ressources (Skills, Reading List, CLI, Contacts)
├── 04 - Journal/            → Notes périodiques (Daily, Weekly, Monthly, Quarterly)
│   ├── Daily/YYYY/Www/      → Organisées par année et semaine
│   ├── Weekly/              → Une note par semaine
│   ├── Monthly/             → Une note par mois
│   ├── Quarterly/           → Une note par trimestre (OKR)
│   └── Yearly/              → Une note par année (bilan)
├── 05 - Archive/            → Notes archivées
├── 05 - Tasks/              → Gestion des tâches
├── 06 - Templates/          → Tous les templates (19 templates)
├── 07 - Config/             → Configuration, scripts QuickAdd, documentation technique
│   ├── scripts/             → Scripts JS pour les macros QuickAdd
│   ├── cache/               → Cache des diffs git (auto-généré)
│   └── Vault Settings.md    → Page admin : activer/désactiver les modules
└── 08 - Starter Kit/        → Kit de démarrage (junction vers repo GitHub)
```

---

## 🔌 Plugins utilisés

### Critiques (le vault ne fonctionne pas sans)

| Plugin | Rôle |
|--------|------|
| **Templater** | Templates dynamiques avec logique JavaScript. Génère les dates, auto-crée les notes périodiques, prompts interactifs à la création des branches/formations |
| **Dataview** | Requêtes dynamiques dans les notes. Affiche les MR actives, tâches en retard, agrégation énergie/focus, TIL de la semaine, progression formations |
| **Meta Bind** | Boutons one-click pour changer le statut des MR, sélecteur d'énergie/focus dans le daily, champs éditables inline |

### Importants

| Plugin | Rôle |
|--------|------|
| **QuickAdd** | Macros : Import GitLab Issue, Sync Branch, Generate MR Message, Standup Clipboard, Auto-Archive, Log Formation |
| **Buttons** | Boutons pour déclencher les commandes QuickAdd depuis les notes |
| **MetaEdit** | Édition rapide du frontmatter (backup pour Meta Bind) |
| **Tasks** | Gestion avancée des tâches avec statuts et filtres |
| **Calendar** | Panneau calendrier — cliquer sur une date crée le Daily |

### Confort

| Plugin | Rôle |
|--------|------|
| **Homepage** | Ouvre automatiquement Home.md au lancement |
| **Heatmap Calendar** | Heatmap d'activité style GitHub sur la page Home |
| **Table Editor** | Édition facilitée des tableaux markdown |
| **Obsidian Git** | Synchronisation automatique du vault via Git |

---

## 📅 Système de Journal (Periodic Notes)

### Hiérarchie temporelle

```
Yearly (bilan annuel + objectifs long terme)
  └── Quarterly (OKR + formations)
       └── Monthly (objectifs du mois + formations + habitudes)
            └── Weekly (objectifs semaine + TIL + formations + stats)
                 └── Daily (tâche ultime + MoSCoW + énergie + progression + routines + standup + activité)
```

Chaque niveau **reporte automatiquement** les tâches non-complétées du niveau précédent via Dataview.

### Daily Note

**Création** : cliquer sur la date dans le panneau Calendar (droite)

Le Daily est le cœur du système. Il contient :

| Section | Description |
|---------|-------------|
| **📊 Progression** | Barres de progression mois/année (inline Dataview) — *désactivable* |
| **🧠 État du jour** | Sélecteur d'énergie + slider de focus via Meta Bind — *désactivable* |
| **↩️ Reports d'hier** | Tâches Pro/Perso non-complétées d'hier (auto via Dataview) |
| **⚠️ Tâches en retard** | Tâches de +3 jours non-complétées (auto) |
| **⚡ Tâche ultime** | LA tâche prioritaire unique de la journée — *désactivable* |
| **🎯 Objectifs du jour** | Priorisés en MoSCoW : 🔴 Must Do / 🟡 Should Do / 🟢 Could Do |
| **🔀 MR & Branches** | Tableau des MR en attente de review et en environnement (auto) |
| **📋 Objectifs semaine** | Rappel des objectifs weekly (auto) |
| **🗺️ Projets actifs** | Liste des projets actifs avec dernière action (auto) |
| **📚 Formation du jour** | Bouton Log Formation + formations actives avec barres de progression + sessions du jour |
| **🔥 Blockers** | Ce qui bloque aujourd'hui |
| **💡 TIL** | Today I Learned — agrégé automatiquement dans le Weekly |
| **📝 Notes de contexte** | Décisions, conversations, *pourquoi* derrière un choix |
| **🎮 Routines** | Suivi quotidien de hobbies/passions (lecture, sport, etc.) — *désactivable* |
| **🗣️ Standup Auto** | Bouton + tâches complétées hier + objectifs du jour + blockers (auto) — *désactivable* |
| **🔄 Rétrospective** | Feedback loop : bien marché / bloqué / ajustement demain |
| **🏁 Complété** | Récap Pro / Perso de la journée |
| **📝 Activité du jour** | Notes modifiées et créées aujourd'hui (Dataview) — *désactivable* |

**Automatisations du Daily** :
- Auto-création du Weekly, Monthly, Quarterly, Yearly s'ils n'existent pas (selon config)
- Organisation automatique dans le dossier `Daily/YYYY/Www/`
- Toutes les dates sont dynamiques (jamais hardcodées)

### Weekly Note

**Création** : cliquer sur le numéro de semaine dans Calendar, ou auto-créé par le Daily

| Section | Description |
|---------|-------------|
| **📅 Daily Notes** | Tableau des dailies de la semaine avec énergie, focus, tâches done/todo |
| **🧠 Énergie & Focus** | Moyennes calculées automatiquement + tableau détaillé par jour |
| **↩️ Reports** | Tâches non-complétées de la semaine précédente |
| **🎯 Objectifs** | Pro / Perso |
| **🔀 MR de la semaine** | MR modifiées cette semaine (auto) |
| **💡 TIL agrégé** | Extrait automatiquement les sections TIL de chaque Daily |
| **📚 Formation** | Progression des formations actives + sessions de la semaine |
| **🚀 Projets actifs** | Liste des projets actifs |
| **🔁 Rétrospective** | Stats auto (tâches, MR, énergie) + Wins / Frustrations / Actions |

### Monthly Note

Agrège les semaines, affiche l'énergie/focus du mois, les MR, et les objectifs alignés sur le trimestre. Inclut :
- Tracker d'habitudes
- Progression des formations actives
- Récap des sessions de formation du mois
- Formations terminées ce mois

### Quarterly Note

Contient les **OKR** (Objectifs + Key Results) avec :
- Barre de progression automatique (% de KR complétés)
- Goal Cascade : vue des objectifs mensuels alignés
- Stats MR du trimestre
- Vue d'ensemble des formations

### Yearly Note

Bilan annuel avec :
- Vue des 4 trimestres
- Énergie/focus moyens de l'année
- Stats MR et formations de l'année
- Objectifs Pro/Perso long terme
- Rétrospective Top 5 accomplissements / leçons

---

*Note : la section Quarterly ci-dessous est conservée pour référence.*

Contient les **OKR** (Objectifs + Key Results) avec :
- Barre de progression automatique (% de KR complétés)
- Goal Cascade : vue des objectifs mensuels alignés
- Stats MR du trimestre (total, en PROD, en review)
- Vue d'ensemble des formations (actives, terminées, stats sessions)

---

## 📚 Système de suivi des Formations

### Principe

Chaque formation a une note dédiée avec :
- Progression multi-axes (ex: "Sections Udemy", "Exercices pratiques")
- Barres de progression visuelles
- Historique des sessions (agrégé depuis les Daily)

### Création d'une formation

`Ctrl+P` → "Templater: Insert template" → Formation

Le template demande interactivement :
1. **Nom** de la formation
2. **Catégorie** (Pro / Perso)
3. **Plateforme** (Udemy, O'Reilly, AWS Skill Builder...)
4. **Axes de progression** (autant que nécessaire, avec total et avancement)

### Logger une session

`Ctrl+P` → "QuickAdd: Log Formation" ou bouton dans le Daily

Le script :
1. Liste les formations actives
2. Demande le nouvel avancement pour chaque axe
3. Met à jour le frontmatter de la formation
4. Ajoute une ligne cochée dans le Daily du jour

### Cascade de visibilité

| Niveau | Ce qui est affiché |
|--------|-------------------|
| **Daily** | Formations actives + barres de progression + sessions du jour |
| **Weekly** | Progression + sessions de la semaine |
| **Monthly** | Progression + récap sessions + formations terminées |
| **Quarterly** | Vue d'ensemble + stats + formations terminées ce trimestre |

---

## 🔀 Système de suivi des Branches / MR

### Principe

Chaque branche de développement a une note dédiée dans le vault. Cette note suit la branche de sa création jusqu'à la mise en production.

### Création d'une note Branch

`Ctrl+P` → "Templater: Insert template" → Branch

Le template demande interactivement :
1. **Projet** (liste configurable)
2. **Nom de la branche** (feat/xxx, fix/xxx)
3. **Type** (feature, bugfix, hotfix, refactor, chore)
4. **US liée** (optionnel)

### Flow de statut

```
🔵 LOCAL → ⏳ MERGE_PENDING → 👀 MERGE_REVIEW → 🔄 CHANGES_REQUESTED → 🧪 DEV → 🧪 STG → 🚀 PROD → 🔒 CLOSED
```

**Changement de statut** : boutons Meta Bind one-click directement dans la note.

### Champs éditables inline

Les champs US liée, MR URL, et Reviewer sont des inputs Meta Bind — modifiables directement dans la note sans toucher au frontmatter YAML.

### Macros QuickAdd

| Macro | Raccourci | Description |
|-------|-----------|-------------|
| **Import GitLab Issue** | `Ctrl+P` → "QuickAdd: Import GitLab Issue" | Coller une URL d'issue → note pré-remplie |
| **Sync Branch** | `Ctrl+P` → "QuickAdd: Sync Branch" | Récupère les commits du repo local dans la note |
| **Generate MR Message** | `Ctrl+P` → "QuickAdd: Generate MR Message" | Analyse le diff → prompt IA copié dans le presse-papier |
| **Standup Clipboard** | `Ctrl+P` → "QuickAdd: Standup Clipboard" | Copie le standup formaté (hier / aujourd'hui / blockers) |
| **Auto-Archive** | `Ctrl+P` → "QuickAdd: Auto-Archive" | Archive les branches CLOSED > 30 jours |
| **Log Formation** | `Ctrl+P` → "QuickAdd: Log Formation" | Met à jour la progression d'une formation + log dans le daily |

Chaque macro est aussi accessible via des **boutons** dans les notes Daily, Branch et Dashboard.

---

## 📋 Templates disponibles (18)

### Journal
| Template | Usage |
|----------|-------|
| Daily | Note quotidienne complète (énergie, MoSCoW, formations, standup, rétrospective) |
| Weekly | Agrégation hebdomadaire (TIL, énergie, formations, stats) |
| Monthly | Objectifs mensuels + habitudes + formations |
| Quarterly | OKR trimestriels + goal cascade + formations |
| Yearly | Bilan annuel + objectifs long terme + stats |

### Développement
| Template | Usage |
|----------|-------|
| Branch | Suivi d'une branche git avec boutons de statut |
| GitLab Issue | Documentation d'une issue (importable via macro) |
| MR-Review | Documenter les reviews reçues avec feedback structuré |
| Sprint | Wrapper de sprint avec MR liées |
| Environment | Documentation d'un environnement (stack, ports, variables) |
| Error-Entry | Catalogue d'erreurs par projet |
| Incident | Postmortem (timeline, root cause, prévention) |
| Release | Notes de release (projets perso) |

### Organisation
| Template | Usage |
|----------|-------|
| Meeting | Notes de réunion avec action items |
| 1on1 | Notes de 1:1 manager avec suivi des demandes |
| Contact | Fiche contact (reviewer, collègue, manager) |
| Reading-Note | Fiche de lecture (article, doc) avec statut |
| Project-Dashboard | Dashboard d'un projet avec roadmap et branches |

### Apprentissage
| Template | Usage |
|----------|-------|
| Formation | Suivi de formation avec progression multi-axes |

---

## 🏷️ Système de Tags

| Tag | Usage |
|-----|-------|
| `#pro` | Tâche/note professionnelle |
| `#perso` | Tâche/note personnelle |
| `#close` | Exclut une tâche des reports (ne sera plus reportée même si non-cochée) |
| `#urgent` | Priorité haute |
| `#important` | Important mais pas urgent |
| `#formation` | Session de formation (utilisé par le système de logging) |

---

## ⌨️ Raccourcis essentiels

| Action | Comment |
|--------|---------|
| Créer un Daily | Cliquer sur la date dans le Calendar |
| Créer un Weekly | Cliquer sur le numéro de semaine dans le Calendar |
| Créer une Branch | `Ctrl+P` → "Templater: Insert template" → Branch |
| Créer une Formation | `Ctrl+P` → "Templater: Insert template" → Formation |
| Logger une session | `Ctrl+P` → "QuickAdd: Log Formation" |
| Importer une Issue | `Ctrl+P` → "QuickAdd: Import GitLab Issue" |
| Sync une branche | `Ctrl+P` → "QuickAdd: Sync Branch" |
| Générer message MR | `Ctrl+P` → "QuickAdd: Generate MR Message" |
| Copier le standup | `Ctrl+P` → "QuickAdd: Standup Clipboard" |
| Changer un statut MR | Ouvrir la note Branch → cliquer sur le bouton du statut |
| Modifier énergie/focus | Dans le Daily → utiliser le sélecteur/slider |
| Chercher une note | `Ctrl+O` |
| Palette de commandes | `Ctrl+P` |

---

## 🔄 Workflow quotidien type

### Matin (5 min)
1. Ouvrir Obsidian → le Daily se crée automatiquement
2. Remplir l'énergie et le focus du jour
3. Lire les reports d'hier et les tâches en retard
4. Définir les objectifs Must Do / Should Do / Could Do
5. Vérifier les MR en attente et les formations actives

### Pendant la journée
- Documenter les TIL au fil de l'eau
- Noter les blockers quand ils arrivent
- Changer les statuts des MR quand elles avancent (un clic)
- Sync les branches quand on commit
- Logger les sessions de formation via le bouton

### Soir (3 min)
1. Remplir la section "Complété aujourd'hui"
2. Remplir la rétrospective (bien marché / bloqué / ajustement)
3. Les tâches non-cochées seront automatiquement reportées demain

### Vendredi (5 min)
1. Ouvrir la note Weekly
2. Vérifier les TIL agrégés et la progression des formations
3. Remplir la rétrospective de la semaine

---

## 🛠️ Configuration initiale (pour un nouveau vault)

Voir le **Starter Kit** dans `08 - Starter Kit/` pour un guide pas-à-pas.

---

## 📦 Starter Kit — Partager le vault

Le dossier `08 - Starter Kit/` est un **junction** (lien symbolique) vers le repo GitHub : `github.com/Kekoeur/StarterPack-ObsidianVault`

### Contenu

```
08 - Starter Kit/
├── README.md                  → Guide d'installation
├── Documentation Vault.md     → Documentation complète
├── Partager le Vault.md       → Guide de partage et contribution
├── Vault Settings.md          → Page admin des modules
├── templates/                 → 19 templates (sections conditionnelles)
├── scripts/                   → 7 scripts QuickAdd
└── config/                    → Config Obsidian de référence
```

### Comment partager

1. Envoyer le lien du repo : `https://github.com/Kekoeur/StarterPack-ObsidianVault`
2. Le collègue clone et suit le `README.md`
3. Il ouvre `Vault Settings.md` pour activer/désactiver les modules
4. Il adapte `git-helpers.js` avec ses projets

### Synchronisation bidirectionnelle

- **Pull** : `git pull` dans le repo → mis à jour dans le vault via le junction
- **Push** : modifier dans le vault → `git commit + push` depuis le repo
- **Script** : `07 - Config/scripts/sync-starterpack.bat` pour synchroniser les templates périodiques

Voir `Partager le Vault.md` pour le guide complet.

### Ce qui est générique vs personnel

| Élément | Générique | À adapter |
|---------|-----------|----------|
| Templates | ✅ | Listes de projets dans les `suggester` |
| Scripts | ✅ | Objet `PROJECTS` dans `git-helpers.js` |
| Vault Settings | ✅ | Toggles selon tes besoins |
| Config | ✅ | Token GitLab, chemins locaux |
| Dashboard/Home | ❌ | À créer selon ses besoins |
| Contenu des notes | ❌ | Personnel |
