<%*
const moment = window.moment;
const weekStr = tp.date.now("YYYY-[W]ww");
const year = tp.date.now("YYYY");
const Q = Math.ceil((moment().month() + 1) / 3);
const quarterStr = `${year}-Q${Q}`;
const monthStr = tp.date.now("YYYY-MM");
const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
const prevWeek = moment().subtract(1, 'week').format('YYYY-[W]ww');
const nextWeek = moment().add(1, 'week').format('YYYY-[W]ww');
const startLabel = moment().startOf('isoWeek').format('DD MMM');
const endLabel = moment().endOf('isoWeek').format('DD MMM');

// ═══ LECTURE CONFIG ═══
const settingsFile = app.vault.getAbstractFileByPath("07 - Config/Vault Settings.md");
let cfg = { branches: true, formations: true, energy: true, projects: true };
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
type: weekly
week: <% weekStr %>
year: <% year %>
quarter: "[[<% quarterStr %>]]"
month: "[[<% monthStr %>]]"
start: <% startOfWeek %>
end: <% endOfWeek %>
tags: [weekly]
---

# 📆 <% weekStr %>

> Du <% startLabel %> au <% endLabel %> | [[<% prevWeek %>|← Sem. précédente]] | [[<% nextWeek %>|Sem. suivante →]] | [[<% monthStr %>|📆 Mois]] | [[<% quarterStr %>|📊 Trimestre]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📅 Daily Notes

```dataview
TABLE WITHOUT ID
  file.link AS "Jour",
  energy AS "Énergie",
  focus_rating AS "Focus",
  length(filter(file.tasks, (t) => t.completed)) AS "✅",
  length(filter(file.tasks, (t) => !t.completed AND !contains(t.text, "#close"))) AS "⬜"
FROM "04 - Journal/Daily"
WHERE week = link("<% weekStr %>")
SORT date ASC
```

%%BEGIN_ENERGY%%
---

## 🧠 Énergie & Focus de la semaine

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "<% weekStr %>");

const energyMap = { "High": 3, "Medium": 2, "Low": 1 };
const energies = pages.where(p => p.energy).map(p => energyMap[p.energy] || 0);
const focuses = pages.where(p => p.focus_rating).map(p => p.focus_rating);

const avgE = energies.length
  ? (energies.array().reduce((a,b) => a+b, 0) / energies.length).toFixed(1) : "—";
const avgF = focuses.length
  ? (focuses.array().reduce((a,b) => a+b, 0) / focuses.length).toFixed(1) : "—";

dv.paragraph(`**Énergie moy. :** ${avgE}/3 | **Focus moy. :** ${avgF}/10`);

dv.table(["Jour", "Énergie", "Focus"],
  pages.sort(p => p.date, "asc").map(p => [
    p.file.link,
    p.energy || "—",
    p.focus_rating ? `${p.focus_rating}/10` : "—"
  ])
);
```
%%END_ENERGY%%

---

## ↩️ Reports de la semaine précédente

### 🏢 Pro

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "<% prevWeek %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#pro")
```

### 🧍 Perso

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "<% prevWeek %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#perso")
```

---

## 🎯 Objectifs de la semaine

### 🏢 Pro
- [ ] <% tp.file.cursor() %> #pro
- [ ] #pro

### 🧍 Perso
- [ ] #perso

%%BEGIN_BRANCHES%%
---

## 🔀 MR de la semaine

```dataviewjs
dv.table(["MR", "Projet", "Statut", "MAJ"],
  dv.pages('"01 - Projects"')
    .where(p => p.type === "branch-doc"
      && p.updated >= dv.date("<% startOfWeek %>")
      && p.updated <= dv.date("<% endOfWeek %>"))
    .sort(p => p.updated, "desc")
    .map(p => [p.file.link, p.project, p.status, p.updated])
);
```
%%END_BRANCHES%%

---

## 💡 TIL de la semaine (agrégé des Dailies)

```dataviewjs
for (let page of dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "<% weekStr %>")
  .sort(p => p.date, "asc")) {

  const content = await dv.io.load(page.file.path);
  const match = content.match(/## 💡 TIL.*?\n([\s\S]*?)(?=\n---|\n## )/);
  if (match && match[1].trim() && match[1].trim() !== ">") {
    dv.header(4, page.file.link);
    dv.paragraph(match[1].trim());
  }
}
```

%%BEGIN_FORMATIONS%%
---

## 📚 Formation de la semaine

### Progression

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
    dv.header(4, `${f.file.link} — ${f.status}`);
    if (rows.length > 0) dv.table(["Axe", "Progression", "Avancée", "%"], rows);
    else dv.paragraph("*Pas de progression configurée.*");
  }
}
```

### Sessions de la semaine

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "<% weekStr %>");

let found = false;
for (let page of pages.sort(p => p.date, "asc")) {
  const tasks = page.file.tasks.where(t => t.text.includes("#formation"));
  if (tasks.length > 0) {
    found = true;
    dv.header(4, page.file.link);
    dv.taskList(tasks);
  }
}
if (!found) dv.paragraph("*Aucune session cette semaine.*");
```
%%END_FORMATIONS%%

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

---

## 🔁 Rétrospective

### 📊 Stats de la semaine (auto)

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "<% weekStr %>");

const energyMap = { "High": 3, "Medium": 2, "Low": 1 };
const energies = pages.where(p => p.energy).map(p => energyMap[p.energy] || 0);
const focuses = pages.where(p => p.focus_rating).map(p => p.focus_rating);

const avgE = energies.length
  ? (energies.array().reduce((a,b) => a+b, 0) / energies.length).toFixed(1) : "—";
const avgF = focuses.length
  ? (focuses.array().reduce((a,b) => a+b, 0) / focuses.length).toFixed(1) : "—";

const mrs = dv.pages('"01 - Projects"')
  .where(p => p.type === "branch-doc"
    && p.updated >= dv.date("<% startOfWeek %>")
    && p.updated <= dv.date("<% endOfWeek %>"));

const mrProd = mrs.where(p => p.status === "PROD").length;
const mrTotal = mrs.length;

let totalDone = 0;
let totalTodo = 0;
for (const p of pages) {
  totalDone += p.file.tasks.where(t => t.completed).length;
  totalTodo += p.file.tasks.where(t => !t.completed && !t.text.includes("#close")).length;
}

dv.paragraph(`| Métrique | Valeur |\n|---------|--------|\n| **Énergie moy.** | ${avgE}/3 |\n| **Focus moy.** | ${avgF}/10 |\n| **Jours trackés** | ${pages.length} |\n| **Tâches complétées** | ${totalDone} |\n| **Tâches restantes** | ${totalTodo} |\n| **MR touchées** | ${mrTotal} |\n| **MR en PROD** | ${mrProd} |`);
```

### 🏆 Wins
-

### 😤 Frustrations
-

### ➡️ Actions pour la semaine prochaine
- [ ]
