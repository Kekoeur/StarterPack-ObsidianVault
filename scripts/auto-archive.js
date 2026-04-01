// ═══════════════════════════════════════════
// QuickAdd Macro : Auto-Archive
// Ctrl+P → "QuickAdd: Auto-Archive"
//
// Archive automatiquement les notes de branches
// avec status CLOSED et updated > 30 jours
// vers 05 - Archive/Branches/
// ═══════════════════════════════════════════

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const moment = window.moment;

  const cutoff = moment().subtract(30, "days").format("YYYY-MM-DD");
  const archiveFolder = "05 - Archive/Branches";

  // Trouver toutes les notes branch-doc CLOSED > 30 jours
  const toArchive = [];
  for (const file of app.vault.getMarkdownFiles()) {
    const meta = app.metadataCache.getFileCache(file);
    if (
      meta?.frontmatter?.type === "branch-doc" &&
      meta.frontmatter.status === "CLOSED" &&
      meta.frontmatter.updated &&
      meta.frontmatter.updated < cutoff
    ) {
      toArchive.push(file);
    }
  }

  if (toArchive.length === 0) {
    new Notice("✅ Rien à archiver — aucune branche CLOSED > 30 jours");
    return;
  }

  const confirm = await quickAddApi.yesNoPrompt(
    `📦 ${toArchive.length} branche(s) CLOSED depuis +30 jours trouvée(s) :\n\n${toArchive.map((f) => `  • ${f.name}`).join("\n")}\n\nArchiver ?`
  );
  if (!confirm) return;

  // Créer le dossier d'archive si nécessaire
  if (!app.vault.getAbstractFileByPath(archiveFolder)) {
    await app.vault.createFolder(archiveFolder);
  }

  let archived = 0;
  for (const file of toArchive) {
    const newPath = `${archiveFolder}/${file.name}`;
    if (!app.vault.getAbstractFileByPath(newPath)) {
      await app.fileManager.renameFile(file, newPath);
      archived++;
    }
  }

  new Notice(`📦 ${archived} branche(s) archivée(s) dans ${archiveFolder}`);
};
