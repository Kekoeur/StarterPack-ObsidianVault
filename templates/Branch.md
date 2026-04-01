<%*
// ═══ BRANCH — Suivi d'une branche git ═══
const project = await tp.system.suggester(
  ["🏢 Projet-A", "🏢 Projet-B", "🏠 Projet-Perso"],
  ["Projet-A", "Projet-B", "Projet-Perso"]
);
if (!project) return;
const branch = await tp.system.prompt("Nom de la branche (ex: feat/login, fix/cart-bug)", "feat/");
if (!branch) return;
const branchType = await tp.system.suggester(
  ["✨ Feature — Nouvelle fonctionnalité", "🐛 Bugfix — Correction de bug", "🚑 Hotfix — Fix urgent en prod", "♻️ Refactor — Refactoring", "🔧 Chore — Maintenance/config"],
  ["feature", "bugfix", "hotfix", "refactor", "chore"]
);
if (!branchType) return;
const us = await tp.system.prompt("N° d'US/ticket lié (laisser vide si aucun)") || "";
-%>
---
type: branch-doc
project: <% project %>
branch: <% branch %>
target: master
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
us: <% us || "null" %>
status: LOCAL
mr_url: null
reviewer: null
tags:
  - <% branchType %>
---

# Branch : `= this.branch`

---

## ⚡ Actions rapides

```button
name 🔄 Sync Branch (pull commits depuis git)
type command
action QuickAdd: Sync Branch
color blue
```
^button-sync

```button
name 📨 Générer Message MR (analyse IA)
type command
action QuickAdd: Generate MR Message
color green
```
^button-generate-mr

---

## 📊 Statut : `VIEW[{status}]`

> **Flow :** 🔵 LOCAL → ⏳ MERGE_PENDING → 👀 MERGE_REVIEW → 🔄 CHANGES_REQUESTED → 🧪 DEV → 🧪 STG → 🚀 PROD → 🔒 CLOSED

### Changer le statut :

```meta-bind-button
label: "🔵 LOCAL"
style: default
actions:
  - type: updateMetadata
    bindTarget: status
    value: "LOCAL"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "⏳ MERGE_PENDING"
style: primary
actions:
  - type: updateMetadata
    bindTarget: status
    value: "MERGE_PENDING"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "👀 MERGE_REVIEW"
style: primary
actions:
  - type: updateMetadata
    bindTarget: status
    value: "MERGE_REVIEW"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "🔄 CHANGES_REQUESTED"
style: destructive
actions:
  - type: updateMetadata
    bindTarget: status
    value: "CHANGES_REQUESTED"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "🧪 DEV"
style: default
actions:
  - type: updateMetadata
    bindTarget: status
    value: "DEV"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "🧪 STG"
style: default
actions:
  - type: updateMetadata
    bindTarget: status
    value: "STG"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "🚀 PROD"
style: primary
actions:
  - type: updateMetadata
    bindTarget: status
    value: "PROD"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

```meta-bind-button
label: "🔒 CLOSED"
style: destructive
actions:
  - type: updateMetadata
    bindTarget: status
    value: "CLOSED"
  - type: updateMetadata
    bindTarget: updated
    value: "{now}"
```

---

## 🎫 Informations

| Champ | Valeur |
|-------|--------|
| **Projet** | `VIEW[{project}]` |
| **Branche** | `VIEW[{branch}]` → `VIEW[{target}]` |
| **US liée** | `INPUT[text:us]` |
| **MR URL** | `INPUT[text:mr_url]` |
| **Reviewer** | `INPUT[text:reviewer]` |
| **Créée le** | `VIEW[{created}]` |
| **MAJ** | `VIEW[{updated}]` |

---

## ✅ Checklist

- [ ] Développement terminé
- [ ] Tests unitaires passent
- [ ] Tests e2e passent
- [ ] Review par un pair demandée
- [ ] Review approuvée
- [ ] Documentation mise à jour
- [ ] Merge request créée
- [ ] Tests en environnement DEV
- [ ] Tests en environnement STG
- [ ] Déployé en PROD
- [ ] Vérifié en PROD

---

## 🔀 Modifications

> Section alimentée automatiquement par "Sync Branch" ou manuellement ci-dessous.

### <% tp.date.now("YYYY-MM-DD HH:mm") %> — Description

**Problème :**
>

**Solution :**
>

**Fichiers modifiés :**
-

**Points d'attention :**
>

**Impact / Compatibilité :**
>

---

## 📊 Historique des commits

> Rempli automatiquement par "Sync Branch"

| Hash | Date | Message | Auteur |
|------|------|---------|--------|
|      |      |         |        |

---

## 📨 Message de MR

> Généré par "Generate MR Message" — à relire avant utilisation

```text

```

---

## 💬 Review Notes

>

---

## 🐛 Problèmes rencontrés

>

---

## 📋 Récapitulatif

**Total fichiers modifiés :** —
**Total commits :** —
**Stats :** —
**Status global :** `= this.status`
**Dernière sync :** —

### Fichiers modifiés
> Rempli automatiquement par "Sync Branch"

### Résumé des changements
> Utilise "Generate MR Message" pour un résumé IA détaillé
