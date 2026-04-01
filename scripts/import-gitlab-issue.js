// ═══════════════════════════════════════════
// QuickAdd Macro : Import GitLab Issue
// Ctrl+P → "QuickAdd: Import GitLab Issue"
// OU bouton dans Daily/Branch
// ═══════════════════════════════════════════

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const path = require("path");
  const vaultPath = app.vault.adapter.basePath || app.vault.adapter.getBasePath();
  const helpersPath = path.join(vaultPath, "07 - Config", "scripts", "git-helpers.js");
  try { delete require.cache[helpersPath]; } catch(e) {}
  const { PROJECTS, getGitLabToken, gitlabApiCall } = require(helpersPath);

  const issueUrl = await quickAddApi.inputPrompt(
    "🔗 URL de l'issue GitLab",
    "https://gitlab.puy-du-fou.com/pdf/ui-vel/-/issues/424"
  );
  if (!issueUrl) return;

  const urlMatch = issueUrl.match(/https?:\/\/([^\/]+)\/(.+)\/-\/issues\/(\d+)/);
  if (!urlMatch) {
    new Notice("❌ URL invalide. Format : https://gitlab.xxx/group/project/-/issues/123");
    return;
  }

  const [_, host, projectPathRaw, issueIid] = urlMatch;

  const projectKey = Object.keys(PROJECTS).find(
    (k) => PROJECTS[k].gitlabPath === projectPathRaw
  );
  const projectName = projectKey || projectPathRaw.split("/").pop();
  const projectConfig = projectKey
    ? PROJECTS[projectKey]
    : { host, gitlabPath: projectPathRaw, vaultPath: `01 - Projects/Pro/${projectName}` };

  let token;
  try {
    token = await getGitLabToken();
  } catch (e) {
    new Notice("❌ " + e);
    return;
  }

  const encoded = encodeURIComponent(projectPathRaw);
  let issue, relatedMRs = [], notes = [];

  try {
    issue = await gitlabApiCall(host, `/projects/${encoded}/issues/${issueIid}`, token);
  } catch (e) {
    new Notice(`❌ Erreur API : ${e}`);
    return;
  }

  try {
    relatedMRs = await gitlabApiCall(host, `/projects/${encoded}/issues/${issueIid}/related_merge_requests`, token);
  } catch (e) {}

  try {
    notes = await gitlabApiCall(host, `/projects/${encoded}/issues/${issueIid}/notes?sort=asc`, token);
  } catch (e) {}

  const title = issue.title || "Sans titre";
  const description = issue.description || "";
  const labels = (issue.labels || []).join(", ");
  const assignee = issue.assignee ? issue.assignee.name : "Non assigné";
  const author = issue.author ? issue.author.name : "Inconnu";
  const milestone = issue.milestone ? issue.milestone.title : "Aucun";
  const state = issue.state;
  const created = issue.created_at ? issue.created_at.split("T")[0] : "";
  const webUrl = issue.web_url;
  const dueDate = issue.due_date || "";

  const mrsText = relatedMRs.length > 0
    ? relatedMRs.map((mr) => `- **MR !${mr.iid}** : [${mr.title}](${mr.web_url}) — \`${mr.state}\``).join("\n")
    : "- Aucune MR liée";

  const commentsText = notes
    .filter((n) => !n.system && n.body)
    .slice(0, 10)
    .map((n) => {
      const date = n.created_at.split("T")[0];
      const auth = n.author?.name || "?";
      return `> **${auth}** (${date}) :\n> ${n.body.split("\n").join("\n> ")}`;
    })
    .join("\n\n") || "> Aucun commentaire";

  const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().substring(0, 60);
  const fileName = `Issue#${issueIid} - ${sanitizedTitle}`;
  const folderPath = `${projectConfig.vaultPath}/RUN`;

  const today = new Date().toISOString().split("T")[0];

  const content = `---
type: gitlab-issue
issue_id: ${issueIid}
project: ${projectName}
status: ${state}
labels: [${labels}]
assignee: ${assignee}
milestone: ${milestone}
created: ${created}
updated: ${today}
due_date: ${dueDate}
url: ${webUrl}
tags: [issue, ${projectName.toLowerCase()}]
---

# Issue #${issueIid} — ${title}

> 🔗 [Voir sur GitLab](${webUrl}) | Créée le ${created} par ${author}

---

## 📋 Informations

| Champ | Valeur |
|-------|--------|
| **ID** | #${issueIid} |
| **Status** | ${state} |
| **Assigné à** | ${assignee} |
| **Labels** | ${labels || "—"} |
| **Milestone** | ${milestone} |
| **Échéance** | ${dueDate || "—"} |

---

## 🎯 Description

${description || "*Pas de description*"}

---

## 🔗 Merge Requests liées

${mrsText}

---

## 💬 Commentaires GitLab

${commentsText}

---

## 🛠️ Notes de développement

>

---

*Dernière importation : ${today}*
`;

  if (!app.vault.getAbstractFileByPath(folderPath)) {
    await app.vault.createFolder(folderPath);
  }

  const filePath = `${folderPath}/${fileName}.md`;
  const existingFile = app.vault.getAbstractFileByPath(filePath);

  if (existingFile) {
    const overwrite = await quickAddApi.yesNoPrompt("⚠️ Cette issue existe déjà. Écraser ?");
    if (overwrite) {
      await app.vault.modify(existingFile, content);
      await app.workspace.openLinkText(filePath, "");
      new Notice(`✅ Issue #${issueIid} mise à jour`);
    }
  } else {
    await app.vault.create(filePath, content);
    await app.workspace.openLinkText(filePath, "");
    new Notice(`✅ Issue #${issueIid} importée`);
  }
};
