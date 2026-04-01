---
type: daily
date: <% tp.date.now("YYYY-MM-DD") %>
week: "[[<% tp.date.now('YYYY-[W]ww') %>]]"
month: "[[<% tp.date.now('YYYY-MM') %>]]"
quarter: "[[<% tp.date.now('YYYY-[Q]Q') %>]]"
energy: null
focus_rating: null
tags: [daily]
---

<%*
const moment = window.moment;
const now = moment();

// ═══ Organisation du daily dans le bon dossier semaine (PRIORITAIRE) ═══
const currentDate = tp.file.title.replace('Daily - ', '');
const year = moment(currentDate).format('YYYY');
const weekNum = moment(currentDate).format('ww');
const weekPath = `04 - Journal/Daily/${year}/W${weekNum}`;

const weekFolderExists = await app.vault.adapter.exists(weekPath);
if (!weekFolderExists) {
  await app.vault.createFolder(weekPath);
}

if (!tp.file.path(true).includes(`W${weekNum}`)) {
  const newPath = `${weekPath}/${tp.file.title}`;
  await tp.file.move(newPath);
}

// ═══ AUTO-CRÉATION des notes périodiques si manquantes ═══
const Q = Math.ceil((now.month() + 1) / 3);

const toCreate = [
  { path: `04 - Journal/Weekly/${now.format('YYYY-[W]ww')}`, template: "Weekly" },
  { path: `04 - Journal/Monthly/${now.format('YYYY-MM')}`, template: "Monthly" },
  { path: `04 - Journal/Quarterly/${now.format('YYYY')}-Q${Q}`, template: "Quarterly" }
];

for (const item of toCreate) {
  try {
    const exists = await app.vault.adapter.exists(item.path + ".md");
    if (!exists) {
      const tpl = tp.file.find_tfile(item.template);
      if (tpl) {
        await tp.file.create_new(tpl, item.path, false);
        new Notice(`✅ Créé : ${item.path}`);
      }
    }
  } catch (e) {
    new Notice(`⚠️ Erreur création ${item.path}: ${e.message}`);
  }
}

// ═══ VARIABLES DYNAMIQUES ═══
const yesterday = tp.date.now("YYYY-MM-DD", -1);
const tomorrow = tp.date.now("YYYY-MM-DD", 1);
const threeDaysAgo = tp.date.now("YYYY-MM-DD", -3);
const weekLink = tp.date.now("YYYY-[W]ww");
const monthLink = tp.date.now("YYYY-MM");
const dayLabel = tp.date.now("dddd DD MMMM YYYY");
-%>

# <% dayLabel %>

> [[Daily - <% yesterday %>|← Hier]] | [[Daily - <% tomorrow %>|Demain →]] | [[<% weekLink %>|📅 Semaine]] | [[<% monthLink %>|📆 Mois]] | [[00 - Dashboard/Dashboard|📊 Dashboard]]

---

## 🧠 État du jour

**Énergie :** `INPUT[inlineSelect(option(High, 🔋 High), option(Medium, 🔵 Medium), option(Low, 🪫 Low)):energy]`

**Focus :** `INPUT[slider(minValue(1), maxValue(10)):focus_rating]` `VIEW[{focus_rating}]`/10

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
  AND file.day >= date(<% tp.date.now("YYYY-MM-DD", -14) %>)
SORT file.name ASC
LIMIT 15
```

---

## 🎯 Objectifs du jour

### 🔴 Must Do (non négociable)
- [ ] <% tp.file.cursor() %> #pro
- [ ] #perso

### 🟡 Should Do
- [ ] #pro

### 🟢 Could Do
- [ ]

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

---

## 📋 Objectifs de la semaine (rappel)

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "<% weekLink %>"
  AND !completed
```

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

---

## 📚 Formation du jour

```button
name 📚 Logger une session de formation
type command
action QuickAdd: Log Formation
color blue
```

> Le bouton met à jour la progression dans la formation ET ajoute la ligne ici automatiquement.
> Tu peux aussi logger manuellement : `- [x] [[Formation]] +X sections — description #formation`

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
      const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
      return [t.label, `\`${bar}\``, `${t.current}/${t.total}`, `${pct}%`];
    });
    dv.header(4, `${f.file.link} — ${f.status}`);
    if (rows.length > 0) dv.table(["Axe", "Progression", "Avancée", "%"], rows);
    else dv.paragraph("*Pas de progression configurée.*");
  }
}
```

### Sessions du jour
- [ ] #formation

---

## 🔥 Blockers & Problèmes

>

---

## 💡 TIL — Today I Learned

>

---

## 📝 Notes de contexte & Décisions

>

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
