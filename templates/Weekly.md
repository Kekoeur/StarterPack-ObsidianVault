---
type: weekly
week: 2026-W14
year: 2026
quarter: "[[2026-Q2]]"
month: "[[2026-04]]"
start: 2026-03-30
end: 2026-04-05
tags: [weekly]
---

# 📆 2026-W14

> Du 30 mars au 05 avr. | [[2026-W13|← Sem. précédente]] | [[2026-W15|Sem. suivante →]] | [[2026-04|📆 Mois]] | [[2026-Q2|📊 Trimestre]] | [[00 - Dashboard/Dashboard|Dashboard]]

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
WHERE week = link("2026-W14")
SORT date ASC
```

---

## 🧠 Énergie & Focus de la semaine

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "2026-W14");

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

---

## ↩️ Reports de la semaine précédente

### 🏢 Pro

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "2026-W13"
  AND !completed AND !contains(text, "#close")
  AND contains(text, "#pro")
```

### 🧍 Perso

```dataview
TASK
FROM "04 - Journal/Weekly"
WHERE file.name = "2026-W13"
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

---

## 🔀 MR de la semaine

```dataviewjs
dv.table(["MR", "Projet", "Statut", "MAJ"],
  dv.pages('"01 - Projects"')
    .where(p => p.type === "branch-doc"
      && p.updated >= dv.date("2026-03-30")
      && p.updated <= dv.date("2026-04-05"))
    .sort(p => p.updated, "desc")
    .map(p => [p.file.link, p.project, p.status, p.updated])
);
```

---

## 💡 TIL de la semaine (agrégé des Dailies)

```dataviewjs
for (let page of dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "2026-W14")
  .sort(p => p.date, "asc")) {

  const content = await dv.io.load(page.file.path);
  const match = content.match(/## 💡 TIL.*?\n([\s\S]*?)(?=\n---|\n## )/);
  if (match && match[1].trim() && match[1].trim() !== ">") {
    dv.header(4, page.file.link);
    dv.paragraph(match[1].trim());
  }
}
```

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
  .where(p => p.week && p.week.path === "2026-W14");

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

## 🔁 Rétrospective

### 📊 Stats de la semaine (auto)

```dataviewjs
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => p.week && p.week.path === "2026-W14");

const energyMap = { "High": 3, "Medium": 2, "Low": 1 };
const energies = pages.where(p => p.energy).map(p => energyMap[p.energy] || 0);
const focuses = pages.where(p => p.focus_rating).map(p => p.focus_rating);

const avgE = energies.length
  ? (energies.array().reduce((a,b) => a+b, 0) / energies.length).toFixed(1) : "—";
const avgF = focuses.length
  ? (focuses.array().reduce((a,b) => a+b, 0) / focuses.length).toFixed(1) : "—";

const mrs = dv.pages('"01 - Projects"')
  .where(p => p.type === "branch-doc"
    && p.updated >= dv.date("2026-03-30")
    && p.updated <= dv.date("2026-04-05"));

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
