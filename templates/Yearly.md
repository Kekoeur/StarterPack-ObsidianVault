<%*
const moment = window.moment;
const year = tp.date.now("YYYY");
const prevYear = String(parseInt(year) - 1);
const nextYear = String(parseInt(year) + 1);
const yearStart = `${year}-01-01`;
const yearEnd = `${year}-12-31`;

// ═══ LECTURE CONFIG ═══
const settingsFile = app.vault.getAbstractFileByPath("07 - Config/Vault Settings.md");
let cfg = { branches: true, formations: true, projects: true, energy: true };
if (settingsFile) {
  const sMeta = app.metadataCache.getFileCache(settingsFile);
  if (sMeta?.frontmatter?.modules) cfg = { ...cfg, ...sMeta.frontmatter.modules };
}

setTimeout(async () => {
  const file = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (!file) return;
  let content = await app.vault.read(file);
  const removeSection = (marker) => {
    const re = new RegExp(`\n*%%BEGIN_${marker}%%[\\s\\S]*?%%END_${marker}%%\n*`, 'g');
    content = content.replace(re, '\n');
  };
  if (!cfg.energy) removeSection('ENERGY');
  if (!cfg.branches) removeSection('BRANCHES');
  if (!cfg.formations) removeSection('FORMATIONS');
  if (!cfg.projects) removeSection('PROJECTS');
  content = content.replace(/%%(?:BEGIN|END)_\w+%%\n?/g, '');
  await app.vault.modify(file, content);
}, 500);
-%>
---
type: yearly
year: <% year %>
tags: [yearly]
---

# 📆 Bilan <% year %>

> [[<% prevYear %>|← Année précédente]] | [[<% nextYear %>|Année suivante →]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📊 Trimestres de l'année

```dataview
TABLE WITHOUT ID
  file.link AS "Trimestre"
FROM "04 - Journal/Quarterly"
WHERE contains(string(quarter), "<% year %>")
SORT quarter ASC
```

%%BEGIN_ENERGY%%
---

## 🧠 Énergie & Focus de l'année

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.date && p.date >= dv.date("<% yearStart %>") && p.date <= dv.date("<% yearEnd %>"));

const energyMap = { "High": 3, "Medium": 2, "Low": 1 };
const energies = pages.where(p => p.energy).map(p => energyMap[p.energy] || 0);
const focuses = pages.where(p => p.focus_rating).map(p => p.focus_rating);

const avgE = energies.length
  ? (energies.array().reduce((a,b) => a+b, 0) / energies.length).toFixed(1) : "—";
const avgF = focuses.length
  ? (focuses.array().reduce((a,b) => a+b, 0) / focuses.length).toFixed(1) : "—";

dv.paragraph(`**Énergie moy. :** ${avgE}/3 | **Focus moy. :** ${avgF}/10 | **Jours trackés :** ${pages.length}`);
```
%%END_ENERGY%%

---

## ↩️ Reports de l'année précédente

```dataview
TASK
FROM "04 - Journal/Yearly"
WHERE file.name = "<% prevYear %>"
  AND !completed AND !contains(text, "#close")
```

---

## 🎯 Objectifs de l'année

### 🏢 Pro
- [ ] <% tp.file.cursor() %> #pro

### 🧍 Perso
- [ ] #perso

%%BEGIN_BRANCHES%%
---

## 🔀 MR de l'année

```dataviewjs
const mrs = dv.pages('"01 - Projects"')
  .where(p => p.type === "branch-doc"
    && p.updated >= dv.date("<% yearStart %>")
    && p.updated <= dv.date("<% yearEnd %>"));

const total = mrs.length;
const inProd = mrs.where(p => p.status === "PROD").length;
const closed = mrs.where(p => p.status === "CLOSED").length;

dv.paragraph(`**Total MR :** ${total} | **En PROD :** ${inProd} | **CLOSED :** ${closed}`);
```
%%END_BRANCHES%%

%%BEGIN_FORMATIONS%%
---

## 📚 Formations de l'année

```dataviewjs
const formations = dv.pages('"02 - Areas"')
  .where(p => p.type === "formation");
const active = formations.where(p => p.status === "in_progress").length;
const completed = formations.where(p => p.status === "completed"
  && p.completed >= dv.date("<% yearStart %>")).length;

dv.paragraph(`**Formations actives :** ${active} | **Terminées cette année :** ${completed}`);
```

```dataview
TABLE WITHOUT ID
  file.link AS "Formation",
  status AS "Statut",
  platform AS "Plateforme",
  completed AS "Terminée le"
FROM "02 - Areas"
WHERE type = "formation" AND (status = "completed" AND completed >= date(<% yearStart %>)) OR status = "in_progress"
SORT status ASC, completed DESC
```
%%END_FORMATIONS%%

%%BEGIN_PROJECTS%%
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
%%END_PROJECTS%%

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
