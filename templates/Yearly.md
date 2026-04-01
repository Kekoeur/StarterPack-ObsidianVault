---
type: yearly
year: 2026
tags: [yearly]
---

# 📆 Bilan 2026

> [[2025|← Année précédente]] | [[2027|Année suivante →]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📊 Trimestres de l'année

```dataview
TABLE WITHOUT ID
  file.link AS "Trimestre"
FROM "04 - Journal/Quarterly"
WHERE contains(string(quarter), "2026")
SORT quarter ASC
```

---

## 🧠 Énergie & Focus de l'année

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.date && p.date >= dv.date("2026-01-01") && p.date <= dv.date("2026-12-31"));

const energyMap = { "High": 3, "Medium": 2, "Low": 1 };
const energies = pages.where(p => p.energy).map(p => energyMap[p.energy] || 0);
const focuses = pages.where(p => p.focus_rating).map(p => p.focus_rating);

const avgE = energies.length
  ? (energies.array().reduce((a,b) => a+b, 0) / energies.length).toFixed(1) : "—";
const avgF = focuses.length
  ? (focuses.array().reduce((a,b) => a+b, 0) / focuses.length).toFixed(1) : "—";

dv.paragraph(`**Énergie moy. :** ${avgE}/3 | **Focus moy. :** ${avgF}/10 | **Jours trackés :** ${pages.length}`);
```

---

## ↩️ Reports de l'année précédente

```dataview
TASK
FROM "04 - Journal/Yearly"
WHERE file.name = "2025"
  AND !completed AND !contains(text, "#close")
```

---

## 🎯 Objectifs de l'année

### 🏢 Pro
- [ ] <% tp.file.cursor() %> #pro

### 🧍 Perso
- [ ] #perso

---

## 🔀 MR de l'année

```dataviewjs
const mrs = dv.pages('"01 - Projects"')
  .where(p => p.type === "branch-doc"
    && p.updated >= dv.date("2026-01-01")
    && p.updated <= dv.date("2026-12-31"));

const total = mrs.length;
const inProd = mrs.where(p => p.status === "PROD").length;
const closed = mrs.where(p => p.status === "CLOSED").length;

dv.paragraph(`**Total MR :** ${total} | **En PROD :** ${inProd} | **CLOSED :** ${closed}`);
```

---

## 📚 Formations de l'année

```dataviewjs
const formations = dv.pages('"02 - Areas"')
  .where(p => p.type === "formation");
const active = formations.where(p => p.status === "in_progress").length;
const completed = formations.where(p => p.status === "completed"
  && p.completed >= dv.date("2026-01-01")).length;

dv.paragraph(`**Formations actives :** ${active} | **Terminées cette année :** ${completed}`);
```

```dataview
TABLE WITHOUT ID
  file.link AS "Formation",
  status AS "Statut",
  platform AS "Plateforme",
  completed AS "Terminée le"
FROM "02 - Areas"
WHERE type = "formation" AND (status = "completed" AND completed >= date(2026-01-01)) OR status = "in_progress"
SORT status ASC, completed DESC
```

---

## 🚀 Projets

```dataview
TABLE WITHOUT ID
  file.link AS "Projet",
  status AS "Statut",
  category AS "Cat."
FROM "01 - Projects"
WHERE type = "project"
SORT status ASC, file.mtime DESC
```

---

## 🔁 Rétrospective de l'année

### 🏆 Top 5 accomplissements
1.
2.
3.
4.
5.

### 📚 Top 5 leçons
1.
2.
3.
4.
5.

### 🔭 Vision pour l'année prochaine
-
