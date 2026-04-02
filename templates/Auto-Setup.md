<%*
// Script Templater - Auto-création Weekly/Monthly + Organisation
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const VAULT_PATH = app.vault.adapter.basePath;
const WEEKLY_PATH = path.join(VAULT_PATH, '04 - Journal', 'Weekly');
const MONTHLY_PATH = path.join(VAULT_PATH, '04 - Journal', 'Monthly');
const DAILY_PATH = path.join(VAULT_PATH, '04 - Journal', 'Daily');

// Fonction pour créer le Weekly si manquant
async function ensureWeeklyExists() {
  const week = moment().format('YYYY-[W]ww');
  const weekFile = `${week}.md`;
  const weekPath = path.join(WEEKLY_PATH, weekFile);
  
  if (!fs.existsSync(weekPath)) {
    const start = moment().startOf('isoWeek');
    const end = moment().endOf('isoWeek');
    const content = `---
type: weekly
week: ${week}
date-start: ${start.format('YYYY-MM-DD')}
date-end: ${end.format('YYYY-MM-DD')}
month: "[[${moment().format('YYYY-MM')}]]"
tags: [weekly]
---

# Semaine ${moment().format('[W]ww - YYYY')}

> Du ${start.format('DD MMM')} au ${end.format('DD MMM')} | [[${moment().format('YYYY-MM')}|Mois]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## ↩️ Reports de la semaine

### 🏢 Pro

\`\`\`dataview
TASK
FROM "04 - Journal/Daily"
WHERE type = "daily" AND date >= "${start.format('YYYY-MM-DD')}" AND date <= "${end.format('YYYY-MM-DD')}" AND !completed AND contains(tags, "#pro")
\`\`\`

### 🧍 Perso

\`\`\`dataview
TASK
FROM "04 - Journal/Daily"
WHERE type = "daily" AND date >= "${start.format('YYYY-MM-DD')}" AND date <= "${end.format('YYYY-MM-DD')}" AND !completed AND contains(tags, "#perso")
\`\`\`

---

## 🎯 Objectifs de la semaine

### 🏢 Pro
- [ ]  #pro

### 🧍 Perso
- [ ]  #perso

---

## 🗓️ Dailies de la semaine

\`\`\`dataview
LIST
FROM "04 - Journal/Daily"
WHERE type = "daily" AND date >= "${start.format('YYYY-MM-DD')}" AND date <= "${end.format('YYYY-MM-DD')}"
SORT date ASC
\`\`\`

---

## 🚀 Projets actifs

\`\`\`dataview
TABLE WITHOUT ID
  file.link AS "Projet",
  last_note AS "Dernière action",
  file.mtime AS "Modifié"
FROM "01 - Projects"
WHERE status = "active"
SORT file.mtime DESC
\`\`\`

---

## 🔁 Rétrospective

### ✅ Ce qui a bien marché
-

### 🔧 Ce qui peut être amélioré
-

### ➡️ Actions pour la semaine prochaine
-
`;
    fs.writeFileSync(weekPath, content);
    console.log(`✅ Weekly ${week} créé`);
  }
}

// Fonction pour créer le Monthly si manquant
async function ensureMonthlyExists() {
  const month = moment().format('YYYY-MM');
  const monthFile = `${month}.md`;
  const monthPath = path.join(MONTHLY_PATH, monthFile);
  
  if (!fs.existsSync(monthPath)) {
    const content = `---
type: monthly
month: ${month}
quarter: "[[${moment().format('YYYY-[Q]Q')}]]"
tags: [monthly]
---

# ${moment().format('MMMM YYYY')}

> [[${moment().format('YYYY-[Q]Q')}|Trimestre]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📅 Récap des semaines

\`\`\`dataview
TABLE WITHOUT ID
  file.link AS "Semaine",
  date-start AS "Du",
  date-end AS "Au"
FROM "04 - Journal/Weekly"
WHERE date-start >= "${month}-01" AND date-start <= "${month}-31"
SORT date-start ASC
\`\`\`

---

## ↩️ Reports du mois

### 🏢 Pro

\`\`\`dataview
TASK
FROM "04 - Journal/Weekly"
WHERE type = "weekly" AND date-start >= "${month}-01" AND date-start <= "${month}-31" AND !completed AND contains(tags, "#pro")
\`\`\`

### 🧍 Perso

\`\`\`dataview
TASK
FROM "04 - Journal/Weekly"
WHERE type = "weekly" AND date-start >= "${month}-01" AND date-start <= "${month}-31" AND !completed AND contains(tags, "#perso")
\`\`\`

---

## 🎯 Objectifs du mois

### 🏢 Pro
- [ ]  #pro

### 🧍 Perso
- [ ]  #perso

---

## 🚀 Projets actifs

\`\`\`dataview
TABLE WITHOUT ID
  file.link AS "Projet",
  last_note AS "Dernière action",
  file.mtime AS "Modifié"
FROM "01 - Projects"
WHERE status = "active"
SORT file.mtime DESC
\`\`\`

---

## 📊 Habitudes

| Habitude | Sem 1 | Sem 2 | Sem 3 | Sem 4 | Sem 5 |
|----------|-------|-------|-------|-------|-------|
| Sport |  |  |  |  |  |
| Lecture |  |  |  |  |  |
| MyHeroes dev |  |  |  |  |  |

---

## 🔁 Rétrospective du mois

### 🏆 Accomplissements majeurs
-

### 📚 Leçons apprises
-

### 🔭 Focus pour le mois prochain
-
`;
    fs.writeFileSync(monthPath, content);
    console.log(`✅ Monthly ${month} créé`);
  }
}

// Fonction pour organiser les dailies par semaine
function organizeDailies() {
  if (!fs.existsSync(DAILY_PATH)) return;
  
  const files = fs.readdirSync(DAILY_PATH);
  const dailyFiles = files.filter(f => f.startsWith('Daily - ') && f.endsWith('.md'));
  
  dailyFiles.forEach(file => {
    const match = file.match(/Daily - (\d{4}-\d{2}-\d{2})\.md/);
    if (!match) return;
    
    const date = match[1];
    const week = moment(date).format('YYYY-[W]ww');
    const weekFolder = path.join(DAILY_PATH, week);
    
    if (!fs.existsSync(weekFolder)) {
      fs.mkdirSync(weekFolder, { recursive: true });
    }
    
    const oldPath = path.join(DAILY_PATH, file);
    const newPath = path.join(weekFolder, file);
    
    if (oldPath !== newPath && !fs.existsSync(newPath)) {
      fs.renameSync(oldPath, newPath);
    }
  });
}

// Exécution
await ensureWeeklyExists();
await ensureMonthlyExists();
organizeDailies();
-%>
