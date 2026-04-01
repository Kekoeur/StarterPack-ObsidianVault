// ═══════════════════════════════════════════
// QuickAdd Macro : Generate MR Message
// Ctrl+P → "QuickAdd: Generate MR Message"
//
// Lit le diff caché par sync-branch.js
// et génère un prompt structuré à copier vers une IA.
// ═══════════════════════════════════════════

const { PROJECTS, gitCommand } = require("./git-helpers.js");

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const activeFile = app.workspace.getActiveFile();
  let projectName = null;
  let branch = null;

  if (activeFile) {
    const meta = app.metadataCache.getFileCache(activeFile);
    if (meta?.frontmatter?.type === "branch-doc") {
      projectName = meta.frontmatter.project;
      branch = meta.frontmatter.branch;
    }
  }

  if (!projectName) {
    const projectNames = Object.keys(PROJECTS);
    projectName = await quickAddApi.suggester(projectNames, projectNames);
    if (!projectName) return;
  }

  if (!branch) {
    branch = await quickAddApi.inputPrompt("Nom de la branche");
    if (!branch) return;
  }

  const branchSlug = branch.replace(/\//g, "-");
  const cachePath = `07 - Config/cache/diff-${projectName}-${branchSlug}.md`;
  const cacheFile = app.vault.getAbstractFileByPath(cachePath);

  let diffContent = "";
  let commits = "";

  if (cacheFile) {
    const cacheData = await app.vault.read(cacheFile);
    const diffMatch = cacheData.match(/```diff\n([\s\S]*?)```/);
    if (diffMatch) diffContent = diffMatch[1];
  }

  if (!diffContent && PROJECTS[projectName]) {
    const config = PROJECTS[projectName];
    try {
      const baseBranch = await gitCommand(
        config.localPath,
        'git symbolic-ref refs/remotes/origin/HEAD 2>nul'
      ).then(r => r.replace("refs/remotes/origin/", "")).catch(() => "master");

      diffContent = await gitCommand(
        config.localPath,
        `git diff ${baseBranch}...${branch}`
      ).catch(() => "");

      commits = await gitCommand(
        config.localPath,
        `git log ${baseBranch}..${branch} --pretty=format:"%h - %s (%ad)" --date=short`
      ).catch(() => "");
    } catch (e) {
      new Notice(`⚠️ Impossible de récupérer le diff git : ${e}`);
    }
  }

  if (!diffContent) {
    new Notice("❌ Aucun diff trouvé. Lance d'abord 'Sync Branch'.");
    return;
  }

  const maxDiffLength = 100000;
  const truncatedDiff = diffContent.length > maxDiffLength
    ? diffContent.substring(0, maxDiffLength) + "\n\n... [DIFF TRONQUÉ — trop volumineux]"
    : diffContent;

  const prompt = `Tu es un développeur senior. Analyse les modifications suivantes entre master et la branche "${branch}" du projet "${projectName}".

Génère un message de Merge Request structuré en français avec :

## Résumé
(2-3 phrases décrivant l'objectif global de la MR)

## Modifications détaillées
(Liste des changements par fichier/composant, groupés logiquement)

## Impact
- ✅ Points positifs
- ⚠️ Points d'attention

## Tests
- Tests à effectuer pour valider

---

COMMITS :
${commits || "(non disponible)"}

DIFF :
\`\`\`
${truncatedDiff}
\`\`\``;

  await navigator.clipboard.writeText(prompt);
  new Notice(`📋 Prompt copié dans le presse-papier ! (${Math.round(prompt.length / 1000)}k chars)\nColle-le dans ton IA préférée.`);

  if (activeFile) {
    const meta = app.metadataCache.getFileCache(activeFile);
    if (meta?.frontmatter?.type === "branch-doc" && meta?.frontmatter?.branch === branch) {
      const shouldInject = await quickAddApi.yesNoPrompt(
        "Injecter le prompt dans la section 'Message de MR' de cette note ?"
      );
      if (shouldInject) {
        let content = await app.vault.read(activeFile);
        const placeholder = "```text\n\n```";
        const replacement = "```text\n[PROMPT COPIÉ DANS LE PRESSE-PAPIER]\nColle la réponse de l'IA ici après analyse.\n```";
        content = content.replace(placeholder, replacement);
        await app.vault.modify(activeFile, content);
        new Notice("✅ Note mise à jour");
      }
    }
  }
};
