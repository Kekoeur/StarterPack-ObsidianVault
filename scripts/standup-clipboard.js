// ═══════════════════════════════════════════
// QuickAdd Macro : Standup Clipboard
// Ctrl+P → "QuickAdd: Standup Clipboard"
// OU bouton dans le Daily
//
// Copie le standup formaté dans le presse-papier :
// - Ce que j'ai fait hier
// - Ce que je fais aujourd'hui
// - Blockers
// ═══════════════════════════════════════════

module.exports = async (params) => {
  const { app } = params;
  const moment = window.moment;

  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

  // Trouver le daily d'hier
  const yesterdayFile = app.vault.getMarkdownFiles().find(
    (f) => f.name === `Daily - ${yesterday}.md`
  );

  // Trouver le daily d'aujourd'hui
  const todayFile = app.vault.getMarkdownFiles().find(
    (f) => f.name === `Daily - ${today}.md`
  );

  let completedYesterday = [];
  let todayObjectives = [];
  let blockers = [];

  // Extraire les tâches complétées d'hier
  if (yesterdayFile) {
    const content = await app.vault.read(yesterdayFile);

    // Chercher les tâches cochées #pro
    const taskRegex = /- \[x\]\s+(.+?)(?:\n|$)/g;
    let match;
    while ((match = taskRegex.exec(content)) !== null) {
      const task = match[1].replace(/#\w+/g, "").trim();
      if (task) completedYesterday.push(task);
    }

    // Chercher la section "Complété aujourd'hui"
    const completedMatch = content.match(
      /## 🏁 Complété aujourd'hui[\s\S]*?### Pro\n([\s\S]*?)(?=### Perso|\n---|\n##)/
    );
    if (completedMatch) {
      const lines = completedMatch[1]
        .split("\n")
        .map((l) => l.replace(/^-\s*/, "").trim())
        .filter((l) => l && l !== "-");
      completedYesterday.push(...lines);
    }
  }

  // Extraire les objectifs d'aujourd'hui
  if (todayFile) {
    const content = await app.vault.read(todayFile);

    // Chercher les tâches non-cochées #pro dans Must Do et Should Do
    const mustDoMatch = content.match(
      /### 🔴 Must Do[\s\S]*?(?=### 🟡|### 🟢|\n---|\n##)/
    );
    const shouldDoMatch = content.match(
      /### 🟡 Should Do[\s\S]*?(?=### 🟢|\n---|\n##)/
    );

    const extractTasks = (section) => {
      if (!section) return [];
      const regex = /- \[ \]\s+(.+?)(?:\n|$)/g;
      const tasks = [];
      let m;
      while ((m = regex.exec(section[0])) !== null) {
        const task = m[1].replace(/#\w+/g, "").trim();
        if (task) tasks.push(task);
      }
      return tasks;
    };

    todayObjectives.push(...extractTasks(mustDoMatch));
    todayObjectives.push(...extractTasks(shouldDoMatch));

    // Chercher les blockers
    const blockerMatch = content.match(
      /## 🔥 Blockers[\s\S]*?(?=\n---|\n##)/
    );
    if (blockerMatch) {
      const lines = blockerMatch[0]
        .split("\n")
        .slice(1)
        .map((l) => l.replace(/^>\s*/, "").replace(/^-\s*/, "").trim())
        .filter((l) => l);
      blockers.push(...lines);
    }
  }

  // Formater le standup
  const yesterdayText =
    completedYesterday.length > 0
      ? completedYesterday.map((t) => `  • ${t}`).join("\n")
      : "  • (rien de noté)";

  const todayText =
    todayObjectives.length > 0
      ? todayObjectives.map((t) => `  • ${t}`).join("\n")
      : "  • (objectifs pas encore définis)";

  const blockerText =
    blockers.length > 0
      ? blockers.map((t) => `  ⚠️ ${t}`).join("\n")
      : "  Aucun blocker";

  const standup = `**Standup ${moment().format("DD/MM/YYYY")}**

✅ Hier :
${yesterdayText}

🎯 Aujourd'hui :
${todayText}

🔥 Blockers :
${blockerText}`;

  await navigator.clipboard.writeText(standup);
  new Notice(
    `📋 Standup copié dans le presse-papier !\n${completedYesterday.length} tâches hier, ${todayObjectives.length} objectifs aujourd'hui`
  );
};
