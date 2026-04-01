<%*
const moment = window.moment;
const Q = Math.ceil((moment().month() + 1) / 3);
const year = tp.date.now("YYYY");
const quarterStr = `${year}-Q${Q}`;
const quarterLabel = `Q${Q} ${year}`;

const prevQ = Q === 1 ? 4 : Q - 1;
const prevYear = Q === 1 ? parseInt(year) - 1 : year;
const prevQuarter = `${prevYear}-Q${prevQ}`;

const nextQ = Q === 4 ? 1 : Q + 1;
const nextYear = Q === 4 ? parseInt(year) + 1 : year;
const nextQuarter = `${nextYear}-Q${nextQ}`;

const quarterStart = moment().startOf('quarter').format('YYYY-MM-DD');
const quarterEnd = moment().endOf('quarter').format('YYYY-MM-DD');
-%>
---
type: quarterly
quarter: <% quarterStr %>
year: <% year %>
tags: [quarterly]
---

# 📊 <% quarterLabel %>

> [[<% prevQuarter %>|← Trimestre précédent]] | [[<% nextQuarter %>|Trimestre suivant →]] | [[00 - Dashboard/Dashboard|Dashboard]]

---

## 📅 Mois du trimestre

```dataview
TABLE WITHOUT ID
  file.link AS "Mois"
FROM "04 - Journal/Monthly"
WHERE contains(quarter, "<% quarterStr %>")
SORT month ASC
```

---

## 🧠 Énergie & Focus du trimestre

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.quarter && p.quarter.path === "<% quarterStr %>");

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

## ↩️ Reports du trimestre précédent

### 🏢 Pro

```dataview
TASK
FROM "04 - Journal/Quarterly"
WHERE file.name = "<% prevQuarter %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#pro")
```

### 🧍 Perso

```dataview
TASK
FROM "04 - Journal/Quarterly"
WHERE file.name = "<% prevQuarter %>"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#perso")
```

---

## 🎯 OKR du trimestre

> Vision : où veux-tu être à la fin de ce trimestre ?

<% tp.file.cursor() %>

### Objectif 1 :
- [ ] KR1 : #pro
- [ ] KR2 : #pro
- [ ] KR3 : #pro

### Objectif 2 :
- [ ] KR1 : #perso
- [ ] KR2 : #perso
- [ ] KR3 : #perso

### 📈 Progression OKR

```dataviewjs
const current = dv.current();
const tasks = current.file.tasks;
const krTasks = tasks.where(t => t.text.includes("KR"));
const done = krTasks.where(t => t.completed).length;
const total = krTasks.length;
const pct = total > 0 ? Math.round((done / total) * 100) : 0;

dv.paragraph(`**Progression :** ${done}/${total} KR complétés (${pct}%)`);

const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
dv.paragraph(`\`${bar}\` ${pct}%`);
```

---

## 🔗 Goal Cascade — Alignement Quarter → Month → Week

```dataviewjs
dv.header(4, "📊 Objectifs mensuels de ce trimestre");
for (let month of dv.pages('"04 - Journal/Monthly"')
  .where(p => p.quarter && p.quarter.path === "<% quarterStr %>")
  .sort(p => p.month, "asc")) {

  const tasks = month.file.tasks.where(t => !t.completed && !t.text.includes("#close"));
  if (tasks.length > 0) {
    dv.header(5, month.file.link);
    dv.taskList(tasks);
  }
}
```

---

## 🔀 MR du trimestre

```dataviewjs
const mrs = dv.pages('"01 - Projects"')
  .where(p => p.type === "branch-doc"
    && p.updated >= dv.date("<% quarterStart %>")
    && p.updated <= dv.date("<% quarterEnd %>"));

const total = mrs.length;
const inProd = mrs.where(p => p.status === "PROD").length;
const inReview = mrs.where(p => p.status === "MERGE_REVIEW" || p.status === "MERGE_PENDING").length;

dv.paragraph(`**Total MR :** ${total} | **En PROD :** ${inProd} | **En review :** ${inReview}`);

dv.table(["MR", "Projet", "Statut"],
  mrs.sort(p => p.updated, "desc")
    .limit(15)
    .map(p => [p.file.link, p.project, p.status])
);
```

---

## 📚 Formations du trimestre

### Vue d'ensemble

```dataviewjs
const formations = dv.pages('"02 - Areas"')
  .where(p => p.type === "formation")
  .sort(p => p.status, "asc");

if (formations.length === 0) {
  dv.paragraph("*Aucune formation.*");
} else {
  for (let f of formations) {
    const progress = f.progress || [];
    const rows = progress.map(t => {
      const pct = t.total > 0 ? Math.round((t.current / t.total) * 100) : 0;
      const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
      return [t.label, `\`${bar}\``, `${t.current}/${t.total}`, `${pct}%`];
    });
    const statusIcon = f.status === "completed" ? "✅" : f.status === "in_progress" ? "🔵" : "⬜";
    dv.header(4, `${statusIcon} ${f.file.link} — ${f.platform || ""} (${f.category || ""})`);
    if (rows.length > 0) dv.table(["Axe", "Progression", "Avancée", "%"], rows);
    else dv.paragraph("*Pas de progression configurée.*");
  }
}
```

### Stats du trimestre

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.quarter && p.quarter.path === "<% quarterStr %>");

let sessionCount = 0;
for (let page of pages) {
  sessionCount += page.file.tasks.where(t => t.text.includes("#formation") && t.completed).length;
}

const formations = dv.pages('"02 - Areas"')
  .where(p => p.type === "formation");
const active = formations.where(p => p.status === "in_progress").length;
const completed = formations.where(p => p.status === "completed"
  && p.completed >= dv.date("<% quarterStart %>")).length;

dv.paragraph(`| Métrique | Valeur |\n|---------|--------|\n| **Sessions complétées** | ${sessionCount} |\n| **Formations actives** | ${active} |\n| **Formations terminées ce trimestre** | ${completed} |`);
```

### Formations terminées ce trimestre

```dataview
TABLE WITHOUT ID
  file.link AS "Formation",
  completed AS "Terminée le",
  total_units + " " + unit_label AS "Total",
  platform AS "Plateforme"
FROM "02 - Areas"
WHERE type = "formation" AND status = "completed" AND completed >= date(<% quarterStart %>) AND completed <= date(<% quarterEnd %>)
SORT completed DESC
```

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

---

## 🔁 Rétrospective du trimestre

### 🏆 Top 3 accomplissements
1.
2.
3.

### 📚 Top 3 leçons
1.
2.
3.

### 🔭 Ajustements pour le prochain trimestre
-
