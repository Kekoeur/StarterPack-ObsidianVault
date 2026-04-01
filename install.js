#!/usr/bin/env node
// ═══════════════════════════════════════════
// install.js — Installe un vault Obsidian complet
// Usage : node install.js [chemin-du-vault]
// Cross-platform : Windows, macOS, Linux
// ═══════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const STARTER = __dirname;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

function copyRecursive(src, dest, stats = { added: 0, skipped: 0 }) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    if (item === ".gitkeep" || item === ".git") continue;
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyRecursive(s, d, stats);
    } else if (!fs.existsSync(d)) {
      fs.copyFileSync(s, d);
      stats.added++;
    } else {
      stats.skipped++;
    }
  }
  return stats;
}

function ensureDirsFromStructure(structurePath, vaultPath) {
  let created = 0;
  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      if (item === ".gitkeep" || item === ".git") continue;
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        const rel = path.relative(structurePath, full);
        const target = path.join(vaultPath, rel);
        if (!fs.existsSync(target)) {
          fs.mkdirSync(target, { recursive: true });
          created++;
        }
        walk(full);
      }
    }
  }
  walk(structurePath);
  return created;
}

async function main() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════╗");
  console.log("  ║  🧠 Obsidian Vault — Installation Starter Pack  ║");
  console.log("  ╚══════════════════════════════════════════════════╝");
  console.log("");
  console.log(`  Starter Pack : ${STARTER}`);
  console.log("");

  let vault = process.argv[2];
  if (!vault) {
    vault = await ask("  Chemin du vault à créer : ");
  }
  vault = vault.trim().replace(/^["']|["']$/g, "");

  if (!vault) {
    console.log("  ❌ Chemin vide. Annulé.");
    rl.close();
    return;
  }

  if (fs.existsSync(vault) && fs.readdirSync(vault).length > 0) {
    const confirm = await ask("  ⚠️  Le dossier existe déjà. Continuer ? (o/n) : ");
    if (confirm.toLowerCase() !== "o") {
      console.log("  Annulé.");
      rl.close();
      return;
    }
  }

  fs.mkdirSync(vault, { recursive: true });

  // 1. Structure de dossiers
  console.log("");
  console.log("  [1/6] Création de la structure de dossiers...");
  const structurePath = path.join(STARTER, "vault-structure");
  if (fs.existsSync(structurePath)) {
    const dirs = ensureDirsFromStructure(structurePath, vault);
    console.log(`    ✅ ${dirs} dossiers créés`);
  } else {
    console.log("    ⚠️  vault-structure/ non trouvé, création manuelle...");
    const dirs = [
      "00 - Dashboard", "01 - Projects/Pro", "01 - Projects/Perso",
      "02 - Areas/Pro/Meetings", "02 - Areas/Pro/1on1", "02 - Areas/Perso",
      "03 - Resources/Contacts", "03 - Resources/Reading List", "03 - Resources/Skills",
      "04 - Journal/Daily", "04 - Journal/Weekly", "04 - Journal/Monthly",
      "04 - Journal/Quarterly", "04 - Journal/Yearly",
      "05 - Archive", "05 - Tasks", "06 - Templates",
      "07 - Config/scripts", "07 - Config/cache",
    ];
    dirs.forEach((d) => fs.mkdirSync(path.join(vault, d), { recursive: true }));
    console.log(`    ✅ ${dirs.length} dossiers créés`);
  }

  // 2. Templates
  console.log("  [2/6] Copie des templates...");
  const tStats = copyRecursive(path.join(STARTER, "templates"), path.join(vault, "06 - Templates"));
  console.log(`    ✅ ${tStats.added} templates copiés, ${tStats.skipped} déjà existants`);

  // 3. Scripts
  console.log("  [3/6] Copie des scripts...");
  const sStats = copyRecursive(path.join(STARTER, "scripts"), path.join(vault, "07 - Config", "scripts"));
  console.log(`    ✅ ${sStats.added} scripts copiés, ${sStats.skipped} déjà existants`);

  // 4. Vault Settings
  console.log("  [4/6] Copie du Vault Settings...");
  const vsTarget = path.join(vault, "07 - Config", "Vault Settings.md");
  if (!fs.existsSync(vsTarget)) {
    fs.copyFileSync(path.join(STARTER, "Vault Settings.md"), vsTarget);
    console.log("    ✅ Vault Settings copié");
  } else {
    console.log("    ⏭️  Déjà existant (non écrasé)");
  }

  // 5. Documentation
  console.log("  [5/6] Copie de la documentation...");
  const docTarget = path.join(vault, "07 - Config", "Documentation Vault.md");
  if (!fs.existsSync(docTarget)) {
    fs.copyFileSync(path.join(STARTER, "Documentation Vault.md"), docTarget);
  }
  console.log("    ✅ Documentation copiée");

  // 6. Home.md
  console.log("  [6/6] Création de Home.md...");
  const homeTarget = path.join(vault, "Home.md");
  if (!fs.existsSync(homeTarget)) {
    fs.writeFileSync(homeTarget, `---
tags: [home]
---

# 🏠 Accueil

> Bienvenue dans ton vault ! Ouvre \`07 - Config/Vault Settings.md\` pour configurer tes modules.

## ⚡ Pour commencer

1. Installer les plugins (voir \`07 - Config/Documentation Vault.md\`)
2. Configurer Templater : Template folder = \`06 - Templates\`
3. Configurer Daily Notes : format = \`[Daily - ]YYYY-MM-DD\`, dossier = \`04 - Journal/Daily\`, template = \`06 - Templates/Daily\`
4. Configurer QuickAdd : Macro folder = \`07 - Config/scripts\`
5. Ouvrir \`07 - Config/Vault Settings.md\` et activer/désactiver les modules
6. Cliquer sur une date dans le Calendar pour créer ton premier Daily !
`);
    console.log("    ✅ Home.md créé");
  } else {
    console.log("    ⏭️  Déjà existant");
  }

  console.log("");
  console.log("  ════════════════════════════════════════════════");
  console.log("  ✅ Installation terminée !");
  console.log("  ════════════════════════════════════════════════");
  console.log("");
  console.log(`  Vault : ${vault}`);
  console.log("");
  console.log("  Prochaines étapes :");
  console.log('    1. Ouvrir Obsidian → "Open folder as vault" → ton vault');
  console.log("    2. Installer les plugins (Templater, Dataview, Meta Bind, QuickAdd...)");
  console.log("    3. Configurer les plugins (voir Documentation Vault.md)");
  console.log("    4. Ouvrir Vault Settings.md et choisir tes modules");
  console.log("    5. Adapter git-helpers.js avec tes projets");
  console.log("");
  console.log("  Pour les mises à jour futures :");
  console.log("    node update-vault.js " + vault);
  console.log("");

  rl.close();
}

main().catch((e) => { console.error(e); rl.close(); });
