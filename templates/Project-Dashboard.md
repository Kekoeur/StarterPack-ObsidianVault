---
type: project
status: active
category: perso
created: 2026-04-01
priority: medium
last_note: ""
tags: [project]
---

# [Nom du Projet] — Dashboard

## Navigation rapide

[[Roadmap]] | [[Architecture Globale]] | [[Branches]]

---

## 📊 Statut

| Champ | Valeur |
|-------|--------|
| **Status** | 🟢 Actif |
| **Phase actuelle** | Phase X — [Nom] |
| **Dernière activité** | 2026-04-01 |
| **Prochaine étape** | [Description] |

---

## 🏗️ Applications / Repos

| App / Repo | Stack | Port / URL | Démarrage |
|-----------|-------|-----------|-----------| 
| `app-1` | [Stack] | [Port] | `[cmd]` |

---

## 🗺️ Roadmap — Progression

| Phase | Nom | Status |
|-------|-----|--------|
| Phase 1 | [Nom] | ✅ Terminée |
| Phase 2 | [Nom] | 🔵 En cours |
| Phase 3 | [Nom] | ⬜ À faire |

---

## 📋 Branches actives

```dataview
TABLE WITHOUT ID
  file.link AS "Branche",
  status AS "Status",
  updated AS "MAJ"
FROM "01 - Projects"
WHERE type = "branch-doc" AND status != "PROD" AND status != "CLOSED"
SORT updated DESC
```

---

## 📓 Journal du projet

```dataview
LIST
FROM "04 - Journal/Daily"
WHERE type = "daily" AND contains(file.outlinks, this.file.link)
SORT date DESC
LIMIT 10
```
