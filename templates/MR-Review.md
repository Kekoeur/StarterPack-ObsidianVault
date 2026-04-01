---
type: mr-review
date: <% tp.date.now("YYYY-MM-DD") %>
project: <% await tp.system.suggester(["🏢 Projet-A", "🏢 Projet-B", "🏠 Projet-Perso"], ["Projet-A", "Projet-B", "Projet-Perso"]) %>
mr_url:
reviewer: <% await tp.system.prompt("Qui a fait la review ?") %>
outcome: <% await tp.system.suggester(["✅ Approuvée", "🔄 Changes requested", "💬 Commentaires seulement"], ["approved", "changes_requested", "comments_only"]) %>
tags: [review]
---

# 👀 Review — <% tp.file.title %>

> Projet : `= this.project` | Reviewer : `= this.reviewer` | Résultat : `= this.outcome`

---

## 📋 Contexte de la MR

> Branche liée :
> Objectif de la MR :

---

## 💬 Feedback reçu

### Points positifs
-

### À corriger
- [ ]
- [ ]

### Suggestions (non bloquantes)
-

---

## 📚 Leçons apprises

> Qu'est-ce que cette review m'a appris ?

-

---

## ✅ Actions prises

- [ ] Corrections appliquées
- [ ] Re-review demandée

---

## 🔗 Liens

- MR : `= this.mr_url`
- Branche :
