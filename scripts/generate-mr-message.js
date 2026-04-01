// ═══════════════════════════════════════════
// QuickAdd Macro : Generate MR Message
// Ctrl+P → "QuickAdd: Generate MR Message"
// OU bouton dans la note Branch
//
// Ce script lit le diff caché par sync-branch.js
// et génère un prompt structuré à copier vers une IA
// pour obtenir le message de MR.
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
    const logContent = "# Generate MR Log — " + new Date().toISOString() + "\n\n```\n" + logs.join("\n") + "\n```\n";
    const logPath = "07 - Config/cache/generate-mr-log.md";
    const existing = app.vault.getAbstractFileByPath(logPath);
    if (existing) await app.vault.modify(existing, logContent);
    else {
      if (!app.vault.getAbstractFileByPath("07 - Config/cache")) await app.vault.createFolder("07 - Config/cache");
      await app.vault.create(logPath, logContent);
    }
  };

  // Essayer de détecter le projet/branche depuis la note active
  const activeFile = app.workspace.getActiveFile();
  let projectName = null;
  let branch = null;

  if (activeFile) {
    logs.push("Note active: " + activeFile.path);
    const meta = app.metadataCache.getFileCache(activeFile);
    if (meta?.frontmatter?.type === "branch-doc") {
      projectName = meta.frontmatter.project;
      branch = meta.frontmatter.branch;
      logs.push("Détecté depuis frontmatter — project: " + projectName + ", branch: " + branch);
    } else {
      logs.push("Note active n'est pas une branch-doc (type: " + (meta?.frontmatter?.type || "aucun") + ")");
    }
  } else {
    logs.push("Pas de note active");
  }

  if (!projectName) {
    const projectNames = Object.keys(PROJECTS);
    projectName = await quickAddApi.suggester(projectNames, projectNames);
    if (!projectName) { logs.push("Annulé: pas de projet sélectionné"); await writeLog(); return; }
    logs.push("Projet sélectionné manuellement: " + projectName);
  } else {
    const match = Object.keys(PROJECTS).find(k => k.toLowerCase() === projectName.toLowerCase());
    if (match) {
      logs.push("Projet normalisé: " + projectName + " → " + match);
      projectName = match;
    } else {
      logs.push("⚠️ Projet non trouvé dans PROJECTS: " + projectName);
    }
  }

  if (!branch) {
    branch = await quickAddApi.inputPrompt("Nom de la branche");
    if (!branch) { logs.push("Annulé: pas de branche saisie"); await writeLog(); return; }
    logs.push("Branche saisie manuellement: " + branch);
  }

  const branchSlug = branch.replace(/\//g, "-");
  const cachePath = `07 - Config/cache/diff-${projectName}-${branchSlug}.md`;
  logs.push("Cache path: " + cachePath);

  const cacheFile = app.vault.getAbstractFileByPath(cachePath);
  logs.push("Cache trouvé: " + !!cacheFile);

  let diffContent = "";
  let commits = "";

  if (cacheFile) {
    const cacheData = await app.vault.read(cacheFile);
    logs.push("Cache lu: " + cacheData.length + " chars");
    const diffMatch = cacheData.match(/```diff\n([\s\S]*?)```/);
    if (diffMatch) {
      diffContent = diffMatch[1];
      logs.push("Diff extrait du cache: " + diffContent.length + " chars");
    } else {
      logs.push("⚠️ Pas de bloc ```diff``` trouvé dans le cache");
    }
  }

  // Si pas de cache, essayer de récupérer depuis git directement
  if (!diffContent && PROJECTS[projectName]) {
    const config = PROJECTS[projectName];
    logs.push("Pas de cache, tentative git direct depuis: " + config.localPath);
    try {
      const baseBranch = await gitCommand(
        config.localPath,
        'git symbolic-ref refs/remotes/origin/HEAD 2>nul'
      ).then(r => r.replace("refs/remotes/origin/", "")).catch(() => "master");
      logs.push("Base branch: " + baseBranch);

      diffContent = await gitCommand(
        config.localPath,
        `git diff ${baseBranch}..."${branch}"`
      ).catch((e) => { logs.push("diff error: " + e); return ""; });
      logs.push("Diff git: " + (diffContent ? diffContent.length + " chars" : "vide"));

      commits = await gitCommand(
        config.localPath,
        `git log ${baseBranch}.."${branch}" --pretty=format:"%h - %s (%ad)" --date=short`
      ).catch((e) => { logs.push("commits error: " + e); return ""; });
      logs.push("Commits git: " + (commits || "vide"));
    } catch (e) {
      logs.push("❌ Erreur git globale: " + e);
    }
  } else if (!diffContent) {
    logs.push("❌ Pas de cache et projet non trouvé dans PROJECTS: " + projectName);
  }

  if (!diffContent) {
    logs.push("❌ Aucun diff trouvé — abandon");
    await writeLog();
    new Notice("❌ Aucun diff trouvé. Lance d'abord 'Sync Branch'. Voir 07 - Config/cache/generate-mr-log.md");
    return;
  }

  // Tronquer le diff si trop long (limite pour les LLM)
  const maxDiffLength = 100000;
  const truncatedDiff = diffContent.length > maxDiffLength
    ? diffContent.substring(0, maxDiffLength) + "\n\n... [DIFF TRONQUÉ — trop volumineux]"
    : diffContent;
  logs.push("Diff final: " + truncatedDiff.length + " chars" + (diffContent.length > maxDiffLength ? " (tronqué)" : ""));

  // Lire le contenu de la note de branche pour le contexte
  let branchDocContent = "";
  if (activeFile) {
    const meta = app.metadataCache.getFileCache(activeFile);
    if (meta?.frontmatter?.type === "branch-doc") {
      branchDocContent = await app.vault.read(activeFile);
      logs.push("Contenu branche lu pour contexte: " + branchDocContent.length + " chars");
    }
  }

  // Construire le chemin MR attendu
  const projectConfig = PROJECTS[projectName];
  const mrFolder = projectConfig ? projectConfig.vaultPath + "/MERGE" : `01 - Projects/Pro/PdF/${projectName}/MERGE`;
  const mrFileName = `MR-${branchSlug}.md`;
  const mrPath = `${mrFolder}/${mrFileName}`;

  // Générer le prompt pour l'IA
  const prompt = `Tu es un développeur senior. Analyse les modifications suivantes entre master et la branche "${branch}" du projet "${projectName}".

## INSTRUCTIONS

**1. Génère un message de Merge Request** structuré en français avec :

## Résumé
(2-3 phrases décrivant l'objectif global de la MR)

## Modifications détaillées
(Liste des changements par fichier/composant, groupés logiquement)

## Impact
- ✅ Points positifs
- ⚠️ Points d'attention

## Tests
- Tests à effectuer pour valider

**2. Crée le fichier de documentation MR** dans le vault Obsidian à ce chemin :
\`${mrPath}\`

Le fichier MR doit suivre cette structure (cf. Prompt Documentation Auto) :

\`\`\`markdown
---
type: mr-doc
project: ${projectName}
branch: ${branch}
created: ${new Date().toISOString().split("T")[0]}
status: DRAFT
tags:
  - merge-request
---

# MR : ${branch}

## Résumé
(résumé généré)

## Modifications détaillées
(détail généré)

## Fichiers modifiés
(liste groupée par type)

## Impact
(impact généré)

## Tests
(tests générés)

## Commits
(liste des commits)
\`\`\`

**3. Mets à jour la note de branche** \`[[${branchSlug}]]\` :
- Dans la section "📨 Message de MR", remplace le contenu du bloc \`\`\`text\`\`\` par le résumé de la MR
- Ajoute un lien vers le fichier MR : \`[[${mrPath}|Voir MR complète]]\`

---

CONTEXTE DE LA NOTE DE BRANCHE :
${branchDocContent ? branchDocContent.substring(0, 5000) : "(non disponible)"}

COMMITS :
${commits || "(non disponible)"}

DIFF :
\`\`\`
${truncatedDiff}
\`\`\``;

  logs.push("Prompt généré: " + prompt.length + " chars");

  // Copier dans le presse-papier
  try {
    await navigator.clipboard.writeText(prompt);
    logs.push("✅ Copié dans le presse-papier");
    new Notice(`📋 Prompt copié ! (${Math.round(prompt.length / 1000)}k chars) — Colle-le dans ton IA.`);
  } catch (e) {
    logs.push("❌ Clipboard error: " + e);
    new Notice("❌ Erreur clipboard — voir log");
  }

  // Aussi injecter dans la note de branche si on est dessus
  if (activeFile) {
    const meta = app.metadataCache.getFileCache(activeFile);
    if (meta?.frontmatter?.type === "branch-doc" && meta?.frontmatter?.branch === branch) {
      logs.push("Note de branche active, proposition d'injection...");
      const shouldInject = await quickAddApi.yesNoPrompt(
        "Injecter le prompt dans la section 'Message de MR' de cette note ?"
      );
      if (shouldInject) {
        let content = await app.vault.read(activeFile);
        // Chercher plusieurs formats de placeholder possibles
        const placeholders = [
          "```text\n\n```",
          "```text\n```",
          "```text\n[PROMPT COPIÉ DANS LE PRESSE-PAPIER]\nColle la réponse de l'IA ici après analyse.\n```"
        ];
        let found = false;
        for (const ph of placeholders) {
          if (content.includes(ph)) {
            content = content.replace(ph, "```text\n[PROMPT COPIÉ DANS LE PRESSE-PAPIER]\nColle la réponse de l'IA ici après analyse.\n\nFichier MR à créer : " + mrPath + "\n```");
            found = true;
            break;
          }
        }
        // Si aucun placeholder, chercher la section et ajouter après
        if (!found) {
          const mrSectionRegex = /## 📨 Message de MR[\s\S]*?(?=\n---\n|$)/;
          if (mrSectionRegex.test(content)) {
            content = content.replace(mrSectionRegex, "## 📨 Message de MR\n\n> Généré par \"Generate MR Message\"\n\n```text\n[PROMPT COPIÉ DANS LE PRESSE-PAPIER]\nColle la réponse de l'IA ici après analyse.\n\nFichier MR à créer : " + mrPath + "\n```");
            found = true;
          }
        }
        // Dernier recours : ajouter la section en fin de fichier avant le récap
        if (!found) {
          const recapIdx = content.indexOf("## 📋 Récapitulatif");
          const insertPoint = recapIdx !== -1 ? recapIdx : content.length;
          const mrSection = "\n---\n\n## 📨 Message de MR\n\n> Généré par \"Generate MR Message\"\n\n```text\n[PROMPT COPIÉ DANS LE PRESSE-PAPIER]\nColle la réponse de l'IA ici après analyse.\n\nFichier MR à créer : " + mrPath + "\n```\n\n";
          content = content.slice(0, insertPoint) + mrSection + content.slice(insertPoint);
          found = true;
        }
        await app.vault.modify(activeFile, content);
        logs.push("✅ Note mise à jour");
        new Notice("✅ Note mise à jour");
      } else {
        logs.push("Injection refusée par l'utilisateur");
      }
    } else {
      logs.push("Note active n'est pas la branche " + branch + " — pas d'injection");
    }
  }

  await writeLog();
};
