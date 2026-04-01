<%*
const moment = window.moment;
const monthStr = tp.date.now("YYYY-MM");
const monthLabel = tp.date.now("MMMM YYYY");
const year = tp.date.now("YYYY");
const Q = Math.ceil((moment().month() + 1) / 3);
const quarterStr = `${year}-Q${Q}`;
const prevMonth = moment().subtract(1, 'month').format('YYYY-MM');
const nextMonth = moment().add(1, 'month').format('YYYY-MM');
const monthStart = moment().startOf('month').format('YYYY-MM-DD');
const monthEnd = moment().endOf('month').format('YYYY-MM-DD');

// ═══ LECTURE CONFIG ═══
const settingsFile = app.vault.getAbstractFileByPath("07 - Config/Vault Settings.md");
let cfg = { branches: true, formations: true, projects: true, habitudes: true, energy: true };
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
  if (!cfg.habitudes) removeSection('HABITUDES');
  content = content.replace(/%%(?:BEGIN|END)_\w+%%\n?/g, '');
  await app.vault.modify(file, content);
}, 500);
-%>
---
type: monthly
month: <% monthStr %>
quarter: "[[<% quarterStr %>]]"
year: <% year %>
tags: [monthly]
---

# 📅 <% monthLabel %>

> [[<% prevMonth %>|← Mois précédent]] | [[<% nextMonth %>|Mois suivant →]] | [[<% quarterStr %>|📊 Trimestre]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📆 Semaines du mois

```dataview
TABLE WITHOUT ID
  file.link AS "Semaine",
  start AS "Début",
  end AS "Fin"
FROM "04 - Journal/Weekly"
WHERE month = link("<% monthStr %>")
SORT week ASC
```

%%BEGIN_ENERGY%%
---

## 🧠 Énergie & Focus du mois

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.month && p.month.path === "<% monthStr %>");

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

## ↩️ Reports du mois précédent

### 🏢 Pro

```dataview
TASK
FROM "04 - Journal/Monthly"
WHERE file.name = "<% prevMonth %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#pro")
```

### 🧍 Perso

```dataview
TASK
FROM "04 - Journal/Monthly"
WHERE file.name = "<% prevMonth %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#perso")
```

---

## 🎯 Objectifs du mois

> Quels objectifs du [[<% quarterStr %>|trimestre]] fais-tu avancer ce mois ?

### 🏢 Pro
- [ ] <% tp.file.cursor() %> #pro

### 🧍 Perso
- [ ] #perso

%%BEGIN_BRANCHES%%
---

## 🔀 MR du mois

```dataviewjs
dv.table(["MR", "Projet", "Statut", "MAJ"],
  dv.pages('"01 - Projects"')
    .where(p => p.type === "branch-doc"
      && p.updated >= dv.date("<% monthStart %>")
      && p.updated <= dv.date("<% monthEnd %>"))
    .sort(p => p.updated, "desc")
    .map(p => [p.file.link, p.project, p.status, p.updated])
);
```
%%END_BRANCHES%%

%%BEGIN_PROJECTS%%
---

## 🚀 Projets actifs

```dataview
TABLE WITHOUT ID
  file.link AS "Projet",
  last_note AS "Dernière action",
  file.mtime AS "Modifié"
FROM "01 - Projects"
WHERE status = "active"
SORT file.mtime DESC
```
%%END_PROJECTS%%

%%BEGIN_FORMATIONS%%
---

## 📚 Formations du mois

### Progression globale

```dataviewjs
const formations = dv.pages('"02 - Areas"')
  .where(p => p.type === "formation" && p.status !== "completed");

if (formations.length === 0) {
  dv.paragraph("*Aucune formation active.*");
} else {
  for (let f of formations) {
    const progress = f.progress || [];
    const rows = progress.map(t => {
      const pct = t.total > 0 ? Math.round((t.current / t.total) * 100) : 0;
      const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
      return [t.label, `\`${bar}\``, `${t.current}/${t.total}`, `${pct}%`];
    });
    dv.header(4, `${f.file.link} — ${f.platform || ""} — ${f.status}`);
    if (rows.length > 0) dv.table(["Axe", "Progression", "Avancée", "%"], rows);
    else dv.paragraph("*Pas de progression configurée.*");
  }
}
```

### Récap sessions du mois

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.month && p.month.path === "<% monthStr %>");

let sessionCount = 0;
for (let page of pages.sort(p => p.date, "asc")) {
  const tasks = page.file.tasks.where(t => t.text.includes("#formation") && t.completed);
  sessionCount += tasks.length;
}
dv.paragraph(`**Sessions complétées ce mois :** ${sessionCount}`);

for (let page of pages.sort(p => p.date, "asc")) {
  const tasks = page.file.tasks.where(t => t.text.includes("#formation") && t.completed);
  if (tasks.length > 0) {
    dv.header(4, page.file.link);
    dv.taskList(tasks);
  }
}
```

### Formations terminées

```dataview
TABLE WITHOUT ID
  file.link AS "Formation",
  completed AS "Terminée le",
  total_units + " " + unit_label AS "Total"
FROM "02 - Areas"
WHERE type = "formation" AND status = "completed" AND completed >= date(<% monthStart %>)
SORT completed DESC
```
%%END_FORMATIONS%%

%%BEGIN_HABITUDES%%
---

## 📊 Habitudes

| Habitude | Sem 1 | Sem 2 | Sem 3 | Sem 4 | Sem 5 |
|----------|-------|-------|-------|-------|-------|
| Sport |  |  |  |  |  |
| Lecture |  |  |  |  |  |
| Dev Perso |  |  |  |  |  |
%%END_HABITUDES%%

---

## 🔁 Rétrospective du mois

### 🏆 Accomplissements majeurs
-

### 📚 Leçons apprises
-

### 🔭 Focus pour le mois prochain
-
