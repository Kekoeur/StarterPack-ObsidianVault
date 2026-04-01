// ═══════════════════════════════════════════
// QuickAdd Macro : Sync Branch
// Ctrl+P → "QuickAdd: Sync Branch"
// ═══════════════════════════════════════════

const { PROJECTS, gitCommand } = require("./git-helpers.js");

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const projectNames = Object.keys(PROJECTS);
  const projectName = await quickAddApi.suggester(
    projectNames.map((p) => `${p} (${PROJECTS[p].localPath})`),
    projectNames
  );
  if (!projectName) return;

  const config = PROJECTS[projectName];

  let branchList;
  try {
    await gitCommand(config.localPath, "git fetch origin").catch(() => {});
    branchList = await gitCommand(
      config.localPath,
      'git branch --list --format="%(refname:short)"'
    );
  } catch (e) {
    new Notice(`❌ Erreur git : ${e}`);
    return;
  }

  const branches = branchList
    .split("\n")
    .map((b) => b.trim().replace(/"/g, ""))
    .filter((b) => b && !["master", "main", "develop"].includes(b));

  if (branches.length === 0) {
    new Notice("Aucune branche feature/fix trouvée");
    return;
  }

  const branch = await quickAddApi.suggester(branches, branches);
  if (!branch) return;

  const today = new Date().toISOString().split("T")[0];
  const timeNow = new Date().toTimeString().split(" ")[0].substring(0, 5);
  const timestamp = `${today} ${timeNow}`;

  let commits = "", diffStat = "", diffFiles = "", diffContent = "";

  try {
    const baseBranch = await gitCommand(
      config.localPath,
      'git symbolic-ref refs/remotes/origin/HEAD 2>nul'
    ).then(r => r.replace("refs/remotes/origin/", "")).catch(() => "master");

    commits = await gitCommand(
      config.localPath,
      `git log ${baseBranch}..${branch} --pretty=format:"%h|%ad|%s|%an" --date=short`
    ).catch(() => "");

    diffStat = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}...${branch} --shortstat`
    ).catch(() => "");

    diffFiles = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}...${branch} --name-status`
    ).catch(() => "");

    diffContent = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}...${branch}`
    ).catch(() => "");
  } catch (e) {
    new Notice(`❌ Erreur git : ${e}`);
    return;
  }

  const commitLines = commits.split("\n").filter((l) => l.trim());
  const commitTable = commitLines
    .map((line) => {
      const parts = line.replace(/"/g, "").split("|");
      return `| \`${parts[0]}\` | ${parts[1] || ""} | ${parts[2] || ""} | ${parts[3] || ""} |`;
    })
    .join("\n");
  const commitCount = commitLines.length;

  const fileLines = diffFiles.split("\n").filter((l) => l.trim());
  const filesFormatted = fileLines
    .map((line) => {
      const [status, ...pathParts] = line.split("\t");
      const filePath = pathParts.join("\t");
      const icon = status === "A" ? "🟢" : status === "D" ? "🔴" : "🟡";
      return `- ${icon} \`${filePath}\``;
    })
    .join("\n");

  const searchFolder = `${config.vaultPath}/${config.branchFolder}`;
  const branchSlug = branch.replace(/\//g, "-");
  let existingNote = null;

  const allFiles = app.vault.getMarkdownFiles();
  for (const file of allFiles) {
    if (file.path.startsWith(searchFolder)) {
      const meta = app.metadataCache.getFileCache(file);
      if (meta?.frontmatter?.branch === branch) {
        existingNote = file;
        break;
      }
    }
  }

  if (!existingNote) {
    const possiblePaths = [
      `${searchFolder}/${branchSlug}.md`,
      `${searchFolder}/${branch.split("/").pop()}.md`,
    ];
    for (const p of possiblePaths) {
      const f = app.vault.getAbstractFileByPath(p);
      if (f) { existingNote = f; break; }
    }
  }

  if (existingNote) {
    let content = await app.vault.read(existingNote);

    content = content.replace(/^updated:.*$/m, `updated: ${today}`);

    const newCommitSection = `## 📊 Historique des commits

| Hash | Date | Message | Auteur |
|------|------|---------|--------|
${commitTable || "| — | — | Aucun commit | — |"}`;

    if (content.includes("## 📊 Historique des commits")) {
      content = content.replace(
        /## 📊 Historique des commits[\s\S]*?(?=\n---\n|\n## 📨|\n## 💬|\n## 🐛|\n## 📋)/,
        newCommitSection + "\n\n"
      );
    }

    const newRecap = `## 📋 Récapitulatif

**Total fichiers modifiés :** ${fileLines.length}
**Total commits :** ${commitCount}
**Stats :** ${diffStat || "—"}
**Status global :** \`= this.status\`
**Dernière sync :** ${timestamp}

### Fichiers modifiés
${filesFormatted || "> Aucun fichier modifié"}

### Résumé des changements
> Utilise "Generate MR Message" pour un résumé IA détaillé`;

    if (content.includes("## 📋 Récapitulatif")) {
      content = content.replace(/## 📋 Récapitulatif[\s\S]*$/, newRecap);
    } else {
      content += `\n\n---\n\n${newRecap}`;
    }

    await app.vault.modify(existingNote, content);
    await app.workspace.openLinkText(existingNote.path, "");
    new Notice(`✅ "${branch}" synchronisée — ${commitCount} commits`);

  } else {
    const createNew = await quickAddApi.yesNoPrompt(
      `Aucune note pour "${branch}". Créer ?`
    );
    if (!createNew) return;

    const us = (await quickAddApi.inputPrompt("US liée (vide si aucune)")) || "";
    const branchType = await quickAddApi.suggester(
      ["feature", "bugfix", "hotfix", "refactor", "chore"],
      ["feature", "bugfix", "hotfix", "refactor", "chore"]
    );

    const newContent = `---
type: branch-doc
project: ${projectName}
branch: ${branch}
target: master
created: ${today}
updated: ${today}
us: ${us || "null"}
status: LOCAL
mr_url: null
reviewer: null
tags:
  - ${branchType || "feature"}
---

# Branch : \`${branch}\`

---

## ⚡ Actions rapides

\`\`\`button
name 🔄 Sync Branch
type command
action QuickAdd: Sync Branch
color blue
\`\`\`
^button-sync

\`\`\`button
name 📨 Générer Message MR
type command
action QuickAdd: Generate MR Message
color green
\`\`\`
^button-generate-mr

---

## 📊 Historique des commits

| Hash | Date | Message | Auteur |
|------|------|---------|--------|
${commitTable || "| — | — | Aucun commit | — |"}

---

## 📨 Message de MR

\`\`\`text

\`\`\`

---

## 📋 Récapitulatif

**Total fichiers modifiés :** ${fileLines.length}
**Total commits :** ${commitCount}
**Stats :** ${diffStat || "—"}
**Status global :** \`= this.status\`
**Dernière sync :** ${timestamp}

### Fichiers modifiés
${filesFormatted || "> Aucun fichier modifié"}
`;

    if (!app.vault.getAbstractFileByPath(searchFolder)) {
      await app.vault.createFolder(searchFolder);
    }

    const filePath = `${searchFolder}/${branchSlug}.md`;
    await app.vault.create(filePath, newContent);
    await app.workspace.openLinkText(filePath, "");
    new Notice(`✅ Note créée pour "${branch}" — ${commitCount} commits`);
  }

  // Stocker le diff en cache pour generate-mr-message
  const cachePath = `07 - Config/cache/diff-${projectName}-${branchSlug}.md`;
  const cacheFolder = "07 - Config/cache";
  if (!app.vault.getAbstractFileByPath(cacheFolder)) {
    await app.vault.createFolder(cacheFolder);
  }

  const cacheContent = `---
type: diff-cache
project: ${projectName}
branch: ${branch}
synced: ${timestamp}
---
\`\`\`diff
${diffContent.substring(0, 500000)}
\`\`\`
`;

  const cacheFile = app.vault.getAbstractFileByPath(cachePath);
  if (cacheFile) {
    await app.vault.modify(cacheFile, cacheContent);
  } else {
    await app.vault.create(cachePath, cacheContent);
  }
};
