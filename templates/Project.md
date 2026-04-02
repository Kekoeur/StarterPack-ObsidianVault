---
type: project
status: active
category: perso
created: 2026-04-02
priority: medium
last_note: ""
tags: [project]
---

# Project

> <% tp.file.cursor() %>

---

## 🎯 Objectif

-

---

## 📋 Tâches en cours

- [ ]  #pro

---

## ✔️ Complété

-

---

## 📝 Notes

-

---

## 🗓️ Dailies liées

```dataview
LIST
FROM "04 - Journal/Daily"
WHERE contains(file.outlinks, this.file.link)
SORT file.name DESC
LIMIT 10
```
