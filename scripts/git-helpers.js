// ═══════════════════════════════════════════
// git-helpers.js — Module utilitaire partagé
// Utilisé par : import-gitlab-issue.js,
//               sync-branch.js,
//               generate-mr-message.js
// ═══════════════════════════════════════════

const PROJECTS = {
  "UI-VEL": {
    host: "gitlab.puydufou.com",
    gitlabPath: "vel-v3/front/ui-vel",
    localPath: "C:\\Users\\cgauthier\\Documents\\Front\\ui-vel",
    vaultPath: "01 - Projects/Pro/PdF/UI-VEL",
    branchFolder: "BRANCH"
  },
  "RESERVATIONS-API": {
    host: "gitlab.puy-du-fou.com",
    gitlabPath: "pdf/reservations-api",
    localPath: "C:\\Users\\cgauthier\\Documents\\Back\\reservations-api",
    vaultPath: "01 - Projects/Pro/PdF/RESERVATIONS-API",
    branchFolder: "MERGE"
  },
  "Blackout": {
    host: "gitlab.com",
    gitlabPath: "MOI/blackout",
    localPath: "C:\\Users\\cgauthier\\dev\\blackout",
    vaultPath: "01 - Projects/Perso/Blackout",
    branchFolder: "04 - Branches"
  },
  "TrackCoach": {
    host: "gitlab.com",
    gitlabPath: "MOI/trackcoach",
    localPath: "C:\\Users\\cgauthier\\dev\\trackcoach",
    vaultPath: "01 - Projects/Perso/TrackCoach",
    branchFolder: "08 - Branches"
  },
  "MyHeroes": {
    host: "gitlab.com",
    gitlabPath: "MOI/myheroes",
    localPath: "C:\\Users\\cgauthier\\dev\\myheroes",
    vaultPath: "01 - Projects/Perso/MyHeroes",
    branchFolder: "04 - Branches"
  }
};

async function getGitLabToken() {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    // Windows: utilise type au lieu de cat
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
    exec(command, { cwd: localPath, maxBuffer: 1024 * 1024 * 10, shell: true }, (err, stdout, stderr) => {
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
