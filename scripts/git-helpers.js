// ═══════════════════════════════════════════
// git-helpers.js — Module utilitaire partagé
// Utilisé par : import-gitlab-issue.js,
//               sync-branch.js,
//               generate-mr-message.js
//
// ⚠️ ADAPTER les projets ci-dessous à votre configuration
// ═══════════════════════════════════════════

const PROJECTS = {
  // ═══ EXEMPLE — Remplacer par vos projets ═══
  "Mon-Projet-Pro": {
    host: "gitlab.example.com",           // Hôte GitLab (gitlab.com, gitlab.entreprise.com)
    gitlabPath: "group/mon-projet-pro",   // Chemin GitLab (group/project)
    localPath: "C:\\Users\\MOI\\dev\\mon-projet-pro",  // Chemin local du repo
    vaultPath: "01 - Projects/Pro/Mon-Projet-Pro",     // Chemin dans le vault
    branchFolder: "BRANCHES"              // Sous-dossier pour les notes de branches
  },
  "Mon-Projet-Perso": {
    host: "gitlab.com",
    gitlabPath: "MOI/mon-projet-perso",
    localPath: "C:\\Users\\MOI\\dev\\mon-projet-perso",
    vaultPath: "01 - Projects/Perso/Mon-Projet-Perso",
    branchFolder: "BRANCHES"
  }
};

async function getGitLabToken() {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    const cmd = process.platform === "win32"
      ? 'type "%USERPROFILE%\\.obsidian-secrets\\gitlab-token"'
      : "cat ~/.obsidian-secrets/gitlab-token";
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject("Token GitLab non trouvé. Voir 07 - Config/git-config.md");
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function gitCommand(localPath, command) {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    const fullCmd = process.platform === "win32"
      ? `cd /d "${localPath}" && ${command}`
      : `cd "${localPath}" && ${command}`;
    exec(fullCmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err && !stdout) {
        reject(stderr || err.message);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function gitlabApiCall(host, endpoint, token) {
  const response = await requestUrl({
    url: `https://${host}/api/v4${endpoint}`,
    headers: { "PRIVATE-TOKEN": token }
  });
  if (response.status >= 400) {
    throw new Error(`GitLab API ${response.status}: ${endpoint}`);
  }
  return response.json;
}

module.exports = { PROJECTS, getGitLabToken, gitCommand, gitlabApiCall };
