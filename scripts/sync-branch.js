// ═══════════════════════════════════════════
// QuickAdd Macro : Sync Branch
// Ctrl+P → "QuickAdd: Sync Branch"
// OU bouton dans Daily/Branch
// ═══════════════════════════════════════════

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const logs = [];

  const path = require("path");
  const vaultPath = app.vault.adapter.basePath || app.vault.adapter.getBasePath();
  const helpersPath = path.join(vaultPath, "07 - Config", "scripts", "git-helpers.js");
  try { delete require.cache[helpersPath]; } catch(e) {}
  const { PROJECTS, gitCommand } = require(helpersPath);

  const writeLog = async () => {
    const logContent = "# Sync Branch Log — " + new Date().toISOString() + "\n\n```\n" + logs.join("\n") + "\n```\n";
    const logPath = "07 - Config/cache/sync-log.md";
    const existing = app.vault.getAbstractFileByPath(logPath);
    if (existing) await app.vault.modify(existing, logContent);
    else {
      if (!app.vault.getAbstractFileByPath("07 - Config/cache")) await app.vault.createFolder("07 - Config/cache");
      await app.vault.create(logPath, logContent);
    }
  };

  const projectNames = Object.keys(PROJECTS);
  const projectName = await quickAddApi.suggester(
    projectNames.map((p) => `${p} (${PROJECTS[p].localPath})`),
    projectNames
  );
  if (!projectName) return;

  const config = PROJECTS[projectName];
  logs.push("Projet: " + projectName);
  logs.push("localPath: " + config.localPath);

  let branchList;
  try {
    logs.push("Fetch origin...");
    await gitCommand(config.localPath, "git fetch origin").catch((e) => logs.push("fetch warning: " + e));
    logs.push("Listing branches...");
    branchList = await gitCommand(
      config.localPath,
      'git branch --list --format="%(refname:short)"'
    );
    logs.push("Branches trouvées: " + branchList.split("\n").length);
  } catch (e) {
    logs.push("❌ Erreur git branch list: " + e);
    await writeLog();
    new Notice(`❌ Erreur git — voir 07 - Config/cache/sync-log.md`);
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
  logs.push("Branche sélectionnée: " + branch);

  const today = new Date().toISOString().split("T")[0];
  const timeNow = new Date().toTimeString().split(" ")[0].substring(0, 5);
  const timestamp = `${today} ${timeNow}`;

  let commits = "", diffStat = "", diffFiles = "", diffContent = "";

  try {
    logs.push("Recherche base branch...");
    const baseBranch = await gitCommand(
      config.localPath,
      'git symbolic-ref refs/remotes/origin/HEAD 2>nul'
    ).then(r => r.replace("refs/remotes/origin/", "")).catch(() => "master");
    logs.push("Base branch: " + baseBranch);

    logs.push('Commande: git log ' + baseBranch + '.."' + branch + '"');
    commits = await gitCommand(
      config.localPath,
      `git log ${baseBranch}.."${branch}" --pretty=format:"%h|%ad|%s|%an" --date=short`
    ).catch((e) => { logs.push("commits error: " + e); return ""; });
    logs.push("Commits: " + (commits ? commits.split("\n").length + " lignes" : "vide"));

    logs.push('Commande: git diff ' + baseBranch + '..."' + branch + '" --shortstat');
    diffStat = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}..."${branch}" --shortstat`
    ).catch((e) => { logs.push("diffStat error: " + e); return ""; });
    logs.push("DiffStat: " + (diffStat || "vide"));

    diffFiles = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}..."${branch}" --name-status`
    ).catch((e) => { logs.push("diffFiles error: " + e); return ""; });
    logs.push("DiffFiles: " + (diffFiles ? diffFiles.split("\n").length + " fichiers" : "vide"));

    diffContent = await gitCommand(
      config.localPath,
      `git diff ${baseBranch}..."${branch}"`
    ).catch((e) => { logs.push("diffContent error: " + e); return ""; });
    logs.push("DiffContent: " + (diffContent ? diffContent.length + " chars" : "vide"));
  } catch (e) {
    logs.push("❌ Erreur git globale: " + e);
    await writeLog();
    new Notice(`❌ Erreur git — voir 07 - Config/cache/sync-log.md`);
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

  // Chercher la note existante
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
    logs.push("✅ Note existante mise à jour");
    await writeLog();
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

\`\`\`button
name ⚡ Changer le Statut
type command
action MetaEdit: Run MetaEdit
color purple
\`\`\`
^button-change-status

---

## 📊 Statut : \`= this.status\`

> **Flow :** 🔵 LOCAL → ⏳ MERGE_PENDING → 👀 MERGE_REVIEW → 🔄 CHANGES_REQUESTED → 🧪 DEV → 🧪 STG → 🚀 PROD → 🔒 CLOSED

---

## ✅ Checklist

- [ ] Développement terminé
- [ ] Tests unitaires passent
- [ ] Review demandée
- [ ] Review approuvée
- [ ] Merge request créée
- [ ] Déployé en PROD

---

## 🔀 Modifications

### ${timestamp} — Sync initiale

**Commits depuis master :** ${commitCount}
**Stats :** ${diffStat || "—"}

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
    logs.push("✅ Nouvelle note créée: " + filePath);
    await writeLog();
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
