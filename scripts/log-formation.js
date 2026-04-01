// ═══════════════════════════════════════════
// QuickAdd Macro : Log Formation
// Ctrl+P → "QuickAdd: Log Formation"
//
// 1. Sélectionne une formation active
// 2. Demande l'avancement par axe
// 3. Met à jour le frontmatter progress
// 4. Ajoute une ligne dans le daily du jour
// ═══════════════════════════════════════════

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const formations = app.vault.getMarkdownFiles().filter(f => {
    const meta = app.metadataCache.getFileCache(f);
    return meta?.frontmatter?.type === "formation" && meta?.frontmatter?.status !== "completed";
  });

  if (formations.length === 0) {
    new Notice("Aucune formation active trouvée.");
    return;
  }

  const names = formations.map(f => {
    const meta = app.metadataCache.getFileCache(f);
    return meta?.frontmatter?.name || f.basename;
  });
  const selected = await quickAddApi.suggester(names, formations);
  if (!selected) return;

  const meta = app.metadataCache.getFileCache(selected);
  const progress = meta?.frontmatter?.progress || [];

  if (progress.length === 0) {
    new Notice("Aucun axe de progression configuré pour cette formation.");
    return;
  }

  const updates = [];
  for (const track of progress) {
    const pct = track.total > 0 ? Math.round((track.current / track.total) * 100) : 0;
    const newVal = await quickAddApi.inputPrompt(
      `${track.label} — actuellement ${track.current}/${track.total} (${pct}%)\nNouvelle valeur actuelle :`,
      String(track.current)
    );
    if (newVal === null || newVal === undefined) return;
    const parsed = parseInt(newVal);
    if (!isNaN(parsed) && parsed !== track.current) {
      updates.push({ label: track.label, old: track.current, new: parsed, total: track.total });
    }
  }

  if (updates.length === 0) {
    new Notice("Aucun changement.");
    return;
  }

  let content = await app.vault.read(selected);
  for (const u of updates) {
    const regex = new RegExp(
      `(- label: "${u.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*\\n\\s*current: )${u.old}`,
      "m"
    );
    content = content.replace(regex, `$1${u.new}`);
  }

  if (meta?.frontmatter?.status === "not_started") {
    content = content.replace(/status: not_started/, "status: in_progress");
    const today = new Date().toISOString().split("T")[0];
    content = content.replace(/started: null/, `started: ${today}`);
  }

  await app.vault.modify(selected, content);

  const formationName = meta?.frontmatter?.name || selected.basename;
  const summary = updates.map(u => {
    const diff = u.new - u.old;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff} ${u.label} (${u.new}/${u.total})`;
  }).join(", ");

  const today = new Date().toISOString().split("T")[0];
  const dailyFiles = app.vault.getMarkdownFiles().filter(f =>
    f.path.includes("04 - Journal/Daily") && f.basename === `Daily - ${today}`
  );

  if (dailyFiles.length > 0) {
    const daily = dailyFiles[0];
    let dailyContent = await app.vault.read(daily);
    const logLine = `- [x] [[${selected.basename}]] ${summary} #formation`;

    const sessionsIdx = dailyContent.indexOf("### Sessions du jour");
    if (sessionsIdx !== -1) {
      const placeholder = "- [ ] #formation";
      const placeholderIdx = dailyContent.indexOf(placeholder, sessionsIdx);
      if (placeholderIdx !== -1) {
        dailyContent = dailyContent.slice(0, placeholderIdx) + logLine + "\n" + dailyContent.slice(placeholderIdx);
      } else {
        const insertIdx = dailyContent.indexOf("\n", sessionsIdx) + 1;
        dailyContent = dailyContent.slice(0, insertIdx) + logLine + "\n" + dailyContent.slice(insertIdx);
      }
    } else {
      const formIdx = dailyContent.indexOf("## 📚 Formation du jour");
      if (formIdx !== -1) {
        const nextSection = dailyContent.indexOf("\n---", formIdx);
        const insertIdx = nextSection !== -1 ? nextSection : dailyContent.length;
        dailyContent = dailyContent.slice(0, insertIdx) + "\n" + logLine + "\n" + dailyContent.slice(insertIdx);
      }
    }

    await app.vault.modify(daily, dailyContent);
  }

  const totalPct = updates.map(u => `${u.label}: ${Math.round((u.new / u.total) * 100)}%`).join(" | ");
  new Notice(`✅ ${formationName} mis à jour — ${totalPct}`);
};
