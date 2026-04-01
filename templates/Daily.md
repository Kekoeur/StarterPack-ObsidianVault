<%*
const moment = window.moment;
const now = moment();

// ═══ LECTURE CONFIG ═══
const settingsFile = app.vault.getAbstractFileByPath("07 - Config/Vault Settings.md");
let cfg = { branches: true, formations: true, monthly: true, quarterly: true, yearly: true, energy: true, standup: true, projects: true, habitudes: true, progressbar: true, ultime: true, routines: true, activity: true };
if (settingsFile) {
  const sMeta = app.metadataCache.getFileCache(settingsFile);
  if (sMeta?.frontmatter?.modules) cfg = { ...cfg, ...sMeta.frontmatter.modules };
}

// ═══ Organisation du daily dans le bon dossier semaine ═══
const currentDate = tp.file.title.replace('Daily - ', '');
const year = moment(currentDate).format('YYYY');
const weekNum = moment(currentDate).format('ww');
const weekPath = `04 - Journal/Daily/${year}/W${weekNum}`;

if (!(await app.vault.adapter.exists(weekPath))) {
  await app.vault.createFolder(weekPath);
}
if (!tp.file.path(true).includes(`W${weekNum}`)) {
  await tp.file.move(`${weekPath}/${tp.file.title}`);
}

// ═══ AUTO-CRÉATION des notes périodiques si manquantes ═══
const Q = Math.ceil((now.month() + 1) / 3);
const toCreate = [
  { path: `04 - Journal/Weekly/${now.format('YYYY-[W]ww')}`, template: "Weekly" },
];
if (cfg.monthly) toCreate.push({ path: `04 - Journal/Monthly/${now.format('YYYY-MM')}`, template: "Monthly" });
if (cfg.quarterly) toCreate.push({ path: `04 - Journal/Quarterly/${now.format('YYYY')}-Q${Q}`, template: "Quarterly" });
if (cfg.yearly) toCreate.push({ path: `04 - Journal/Yearly/${now.format('YYYY')}`, template: "Yearly" });

for (const item of toCreate) {
  try {
    if (!(await app.vault.adapter.exists(item.path + ".md"))) {
      const tpl = tp.file.find_tfile(item.template);
      if (tpl) { await tp.file.create_new(tpl, item.path, false); new Notice(`✅ Créé : ${item.path}`); }
    }
  } catch (e) { new Notice(`⚠️ Erreur création ${item.path}: ${e.message}`); }
}

// ═══ VARIABLES ═══
const yesterday = tp.date.now("YYYY-MM-DD", -1);
const tomorrow = tp.date.now("YYYY-MM-DD", 1);
const threeDaysAgo = tp.date.now("YYYY-MM-DD", -3);
const twoWeeksAgo = tp.date.now("YYYY-MM-DD", -14);
const weekLink = tp.date.now("YYYY-[W]ww");
const monthLink = tp.date.now("YYYY-MM");
const dayLabel = tp.date.now("dddd DD MMMM YYYY");
const dayOfMonth = now.date();
const daysInMonth = now.daysInMonth();
const dayOfYear = now.dayOfYear();
const daysInYear = now.isLeapYear() ? 366 : 365;

// ═══ SUPPRESSION POST-GÉNÉRATION ═══
setTimeout(async () => {
  const file = app.vault.getAbstractFileByPath(tp.file.path(true));
  if (!file) return;
  let content = await app.vault.read(file);
  const removeSection = (marker) => {
    const re = new RegExp(`\n*%%BEGIN_${marker}%%[\\s\\S]*?%%END_${marker}%%\n*`, 'g');
    content = content.replace(re, '\n');
  };
  if (!cfg.energy) removeSection('ENERGY');
  if (!cfg.progressbar) removeSection('PROGRESSBAR');
  if (!cfg.ultime) removeSection('ULTIME');
  if (!cfg.branches) removeSection('BRANCHES');
  if (!cfg.projects) removeSection('PROJECTS');
  if (!cfg.formations) removeSection('FORMATIONS');
  if (!cfg.routines) removeSection('ROUTINES');
  if (!cfg.standup) removeSection('STANDUP');
  if (!cfg.activity) removeSection('ACTIVITY');
  content = content.replace(/%%(?:BEGIN|END)_\w+%%\n?/g, '');
  await app.vault.modify(file, content);
}, 500);
-%>
---
type: daily
date: <% tp.date.now("YYYY-MM-DD") %>
week: "[[<% weekLink %>]]"
month: "[[<% monthLink %>]]"
quarter: "[[<% tp.date.now('YYYY-[Q]Q') %>]]"
energy: null
focus_rating: null
tags: [daily]
---

# <% dayLabel %>

> [[Daily - <% yesterday %>|← Hier]] | [[Daily - <% tomorrow %>|Demain →]] | [[<% weekLink %>|📅 Semaine]] | [[<% monthLink %>|📆 Mois]] | [[00 - Dashboard/Dashboard|📊 Dashboard]]

%%BEGIN_PROGRESSBAR%%

> 📅 Mois :
> ```progressbar
> kind: manual
> name: "Mois (<% dayOfMonth %>/<% daysInMonth %>)"
> value: <% dayOfMonth %>
> max: <% daysInMonth %>
> ```
> 📆 Année :
> ```progressbar
> kind: manual
> name: "Année (<% dayOfYear %>/<% daysInYear %>)"
> value: <% dayOfYear %>
> max: <% daysInYear %>
> ```

%%END_PROGRESSBAR%%

%%BEGIN_ENERGY%%
---

## 🧠 État du jour

**Énergie :** `INPUT[inlineSelect(option(High, 🔋 High), option(Medium, 🔵 Medium), option(Low, 🪫 Low)):energy]`

**Focus :** `INPUT[slider(minValue(1), maxValue(10)):focus_rating]` `VIEW[{focus_rating}]`/10
%%END_ENERGY%%

---

## ↩️ Reports d'hier

### 🏢 Pro

```dataview
TASK
FROM "04 - Journal/Daily"
WHERE file.name = "Daily - <% yesterday %>"
  AND !completed
  AND !contains(text, "#close")
  AND contains(text, "#pro")
```

### 🧍 Perso

```dataview
TASK
FROM "04 - Journal/Daily"
WHERE file.name = "Daily - <% yesterday %>"
  AND !completed
  AND !contains(text, "#close")
  AND contains(text, "#perso")
```

---

## ⚠️ Tâches en retard (+3 jours)

```dataview
TASK
FROM "04 - Journal/Daily"
WHERE !completed
  AND !contains(text, "#close")
  AND file.day <= date(<% threeDaysAgo %>)
  AND file.day >= date(<% twoWeeksAgo %>)
SORT file.name ASC
LIMIT 15
```

%%BEGIN_ULTIME%%
---

## ⚡ Tâche ultime du jour

> LA tâche que tu dois absolument terminer aujourd'hui. Une seule.

- [ ] #pro
%%END_ULTIME%%

---

## 🎯 Objectifs du jour

### 🔴 Must Do (non négociable)
- [ ] <% tp.file.cursor() %> #pro
- [ ] #perso

### 🟡 Should Do
- [ ] #pro

### 🟢 Could Do
- [ ]

%%BEGIN_BRANCHES%%
---

## 🔀 MR & Branches actives

### En attente (Review / Merge / Changes)

```dataview
TABLE WITHOUT ID
  file.link AS "MR",
  project AS "Projet",
  status AS "Status",
  updated AS "MAJ"
FROM "01 - Projects"
WHERE type = "branch-doc"
  AND (status = "MERGE_PENDING" OR status = "MERGE_REVIEW" OR status = "CHANGES_REQUESTED")
SORT updated DESC
```

### En environnement (DEV / STG)

```dataview
TABLE WITHOUT ID
  file.link AS "MR",
  project AS "Projet",
  status AS "Status"
FROM "01 - Projects"
WHERE type = "branch-doc"
  AND (status = "DEV" OR status = "STG")
SORT status ASC
```
%%END_BRANCHES%%

---

## 📋 Objectifs de la semaine (rappel)

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "<% weekLink %>"
  AND !completed
```

%%BEGIN_PROJECTS%%
---

## 🗺️ Projets actifs

```dataview
TABLE WITHOUT ID
  file.link AS "Projet",
  last_note AS "Dernière action"
FROM "01 - Projects"
WHERE status = "active"
SORT file.mtime DESC
```
%%END_PROJECTS%%

%%BEGIN_FORMATIONS%%
---

## 📚 Formation du jour

```button
name 📚 Logger une session de formation
type command
action QuickAdd: Log Formation
color blue
```

> Logger manuellement : `- [x] [[Formation]] +X sections — description #formation`

### Formations actives

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
      const bar = `<div style="background:#e0e0e0;border-radius:8px;height:14px;width:160px;display:inline-block"><div style="background:linear-gradient(90deg,#4caf50,#81c784);height:100%;border-radius:8px;width:${pct}%"></div></div>`;
      return [t.label, bar, `${t.current}/${t.total}`, `${pct}%`];
    });
    dv.header(4, `${f.file.link} — ${f.status}`);
    if (rows.length > 0) dv.table(["Axe", "Progression", "Avancée", "%"], rows);
    else dv.paragraph("*Pas de progression configurée.*");
  }
}
```

### Sessions du jour
- [ ] #formation
%%END_FORMATIONS%%

%%BEGIN_ROUTINES%%
---

## 🎮 Routines du jour

### 📖 Lecture en cours
- Livre / article :
- Pages / temps :

### 🏃 Sport / Activité
- Type :
- Durée :

### 🎯 Autre
-
%%END_ROUTINES%%

---

## 🔥 Blockers & Problèmes

>

---

## 💡 TIL — Today I Learned

>

---

## 📝 Notes de contexte & Décisions

>

%%BEGIN_STANDUP%%
---

## 🗣️ Standup Auto

```button
name 📋 Copier le standup dans le presse-papier
type command
action QuickAdd: Standup Clipboard
color blue
```

### Hier (complété)

```dataview
TASK
FROM "04 - Journal/Daily"
WHERE file.name = "Daily - <% yesterday %>"
  AND completed
  AND contains(text, "#pro")
LIMIT 15
```

### Aujourd'hui
*(Voir Must Do ci-dessus)*

### Blockers
*(Voir section Blockers ci-dessus)*
%%END_STANDUP%%

---

## 🔄 Rétrospective de fin de journée

> **✅ Ce qui a bien marché :**
>
> **❌ Ce qui a bloqué :**
>
> **➡️ Ajustement pour demain :**

---

## 🏁 Complété aujourd'hui

### Pro
-

### Perso
-

%%BEGIN_ACTIVITY%%
---

## 📝 Activité du jour

### Notes modifiées

```dataview
LIST
WHERE dateformat(file.mtime, "yyyy-MM-dd") = "<% tp.date.now("YYYY-MM-DD") %>" AND this.file.name != file.name
SORT file.mtime DESC
LIMIT 20
```

### Notes créées

```dataview
LIST
WHERE dateformat(file.ctime, "yyyy-MM-dd") = "<% tp.date.now("YYYY-MM-DD") %>" AND this.file.name != file.name
SORT file.ctime DESC
```
%%END_ACTIVITY%%
