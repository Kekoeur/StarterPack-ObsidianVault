---
type: release
version: <% await tp.system.prompt("Numéro de version (ex: 1.2.0, 2.0.0-beta)") %>
date: <% tp.date.now("YYYY-MM-DD") %>
project: <% await tp.system.suggester(["🏠 Projet-A", "🏠 Projet-B"], ["Projet-A", "Projet-B"]) %>
environment: <% await tp.system.suggester(["🟢 DEV", "🟣 STG — Staging", "🔴 PROD — Production"], ["DEV", "STG", "PROD"]) %>
tags: [release]
---

# 🚀 Release `= this.version` — `= this.project`

> Env : `= this.environment` | Date : `= this.date`

---

## 📋 Changements inclus

### MR mergées dans cette release

```dataviewjs
dv.table(["MR", "Statut"],
  dv.pages(`"01 - Projects/Perso/${dv.current().project}"`)
    .where(p => p.type === "branch-doc" && p.status === "PROD")
    .sort(p => p.updated, "desc")
    .limit(10)
    .map(p => [p.file.link, p.status])
);
```

---

## ✨ Nouvelles fonctionnalités

-

## 🐛 Bugs corrigés

-

## ♻️ Améliorations techniques

-

---

## 🧪 Tests effectués

- [ ] Tests unitaires passent
- [ ] Tests e2e passent
- [ ] Test manuel en STG
- [ ] Vérification post-déploiement

---

## 📝 Notes de déploiement

> Commandes, migrations, config à changer :

---

## ⚠️ Known Issues

>
