<%*
const name = await tp.system.prompt("Nom de la formation");
if (!name) return;
const category = await tp.system.suggester(
  ["🏢 Pro", "🧍 Perso"],
  ["pro", "perso"]
);
if (!category) return;
const platform = await tp.system.prompt("Plateforme / Source (ex: Udemy, O'Reilly, AWS Skill Builder)", "") || "";

// Multi-progression
const tracks = [];
let addMore = true;
while (addMore) {
  const label = await tp.system.prompt(`Axe de progression ${tracks.length + 1} (ex: "Sections Udemy", "Pages livre", "Heures vidéo")`, "");
  if (!label) break;
  const total = await tp.system.prompt(`Total pour "${label}"`, "0");
  const current = await tp.system.prompt(`Avancement actuel pour "${label}"`, "0");
  tracks.push({ label, current: parseInt(current) || 0, total: parseInt(total) || 0 });
  addMore = await tp.system.suggester(["➕ Ajouter un autre axe", "✅ Terminé"], [true, false]);
}

const progressYaml = tracks.map(t =>
  `  - label: "${t.label}"\n    current: ${t.current}\n    total: ${t.total}`
).join("\n");
-%>
---
type: formation
name: "<% name %>"
category: <% category %>
platform: "<% platform %>"
status: not_started
started: null
completed: null
created: <% tp.date.now("YYYY-MM-DD") %>
progress:
<% progressYaml %>
tags: [formation, <% category %>]
---

# 📚 <% name %>

**Statut :** `VIEW[{status}]` | **Plateforme :** `VIEW[{platform}]`

---

## 📊 Progression

```dataviewjs
const p = dv.current();
const progress = p.progress || [];

if (progress.length === 0) {
  dv.paragraph("*Aucune progression configurée.*");
} else {
  const rows = [];
  for (const track of progress) {
    const current = track.current || 0;
    const total = track.total || 1;
    const pct = Math.round((current / total) * 100);
    const bar = `<div style="background:#e0e0e0;border-radius:8px;height:14px;width:160px;display:inline-block"><div style="background:linear-gradient(90deg,#4caf50,#81c784);height:100%;border-radius:8px;width:${pct}%"></div></div>`;
    rows.push([track.label, `\`${bar}\``, `${current}/${total}`, `${pct}%`]);
  }
  dv.table(["Axe", "Progression", "Avancée", "%"], rows);
}
```

## 📅 Historique des sessions

```dataviewjs
const name = dv.current().file.name;
const pages = dv.pages('"04 - Journal/Daily"')
  .where(p => {
    const tasks = p.file.tasks.where(t => t.text.includes("#formation") && t.text.includes(name));
    return tasks.length > 0;
  })
  .sort(p => p.date, "desc");

if (pages.length === 0) {
  dv.paragraph("*Aucune session enregistrée.*");
} else {
  for (let page of pages) {
    const tasks = page.file.tasks.where(t => t.text.includes("#formation") && t.text.includes(name));
    dv.header(4, page.file.link);
    dv.taskList(tasks);
  }
}
```

---

## 📝 Notes

>

---

## 🔗 Ressources

-
