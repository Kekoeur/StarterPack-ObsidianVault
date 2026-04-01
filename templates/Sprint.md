---
type: sprint
sprint_id: 05
project:
start: 2026-03-28
end: 2026-04-11
goal: ""
status: active
tags: [sprint]
---

# 🏃 `= this.sprint_id` — `= this.project`

> Du `= this.start` au `= this.end` | Status : `= this.status`

---

## 🎯 Objectif du sprint

>

---

## 📋 Tâches / US du sprint

- [ ]
- [ ]

---

## 🔀 MR liées

```dataviewjs
dv.table(["MR", "Statut", "MAJ"],
  dv.pages(`"01 - Projects"`)
    .where(p => p.type === "branch-doc"
      && p.project === dv.current().project
      && p.updated >= dv.date(dv.current().start)
      && p.updated <= dv.date(dv.current().end))
    .sort(p => p.updated, "desc")
    .map(p => [p.file.link, p.status, p.updated])
);
```

---

## 🔁 Rétrospective

### ✅ Ce qui a bien marché
-

### 🔧 À améliorer
-

### ➡️ Actions
- [ ]
