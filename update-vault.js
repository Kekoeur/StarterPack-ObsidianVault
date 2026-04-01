#!/usr/bin/env node
// ═══════════════════════════════════════════
// update-vault.js — Met à jour un vault depuis le Starter Pack
// Usage : node update-vault.js [chemin-du-vault]
// Cross-platform : Windows, macOS, Linux
// ═══════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const STARTER = __dirname;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

function filesAreDifferent(a, b) {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return true;
  return Buffer.compare(fs.readFileSync(a), fs.readFileSync(b)) !== 0;
}

async function main() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════╗");
  console.log("  ║  🔄 Obsidian Vault — Mise à jour Starter Pack   ║");
  console.log("  ╚══════════════════════════════════════════════════╝");
  console.log("");

  let vault = process.argv[2];
  if (!vault) {
    vault = await ask("  Chemin de ton vault Obsidian : ");
  }
  vault = vault.trim().replace(/^["']|["']$/g, "");

  if (!vault || !fs.existsSync(path.join(vault, "06 - Templates"))) {
    console.log("  ❌ Ce dossier ne semble pas être un vault valide.");
    rl.close();
    return;
  }

  console.log(`  Starter Pack : ${STARTER}`);
  console.log(`  Vault        : ${vault}`);
  console.log("");

  // 1. Git pull
  console.log("  [1/6] Pull des dernières mises à jour...");
  try {
    const result = execSync("git pull", { cwd: STARTER, encoding: "utf8" });
    console.log(`    ${result.trim()}`);
  } catch (e) {
    console.log("    ⚠️  Git pull a échoué. On continue avec la version locale.");
  }
  console.log("");

  // 2. Sync templates
  console.log("  [2/6] Mise à jour des templates...");
  const templatesDir = path.join(STARTER, "templates");
  let tAdded = 0, tUpdated = 0;
  for (const file of fs.readdirSync(templatesDir)) {
    const src = path.join(templatesDir, file);
    const dest = path.join(vault, "06 - Templates", file);
    if (!fs.statSync(src).isFile()) continue;
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`    ➕ Nouveau : ${file}`);
      tAdded++;
    } else if (filesAreDifferent(src, dest)) {
      fs.copyFileSync(src, dest);
      console.log(`    🔄 Mis à jour : ${file}`);
      tUpdated++;
    }
  }
  console.log(`    ✅ Templates : ${tAdded} ajoutés, ${tUpdated} mis à jour`);
  console.log("");

  // 3. Sync scripts
  console.log("  [3/6] Mise à jour des scripts...");
  const scriptsDir = path.join(STARTER, "scripts");
  let sAdded = 0, sUpdated = 0;
  for (const file of fs.readdirSync(scriptsDir)) {
    const src = path.join(scriptsDir, file);
    const dest = path.join(vault, "07 - Config", "scripts", file);
    if (!fs.statSync(src).isFile()) continue;
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`    ➕ Nouveau : ${file}`);
      sAdded++;
    } else if (filesAreDifferent(src, dest)) {
      fs.copyFileSync(src, dest);
      console.log(`    🔄 Mis à jour : ${file}`);
      sUpdated++;
    }
  }
  console.log(`    ✅ Scripts : ${sAdded} ajoutés, ${sUpdated} mis à jour`);
  console.log("");

  // 4. Sync structure de dossiers
  console.log("  [4/6] Vérification de la structure de dossiers...");
  let dirsCreated = 0;
  const structurePath = path.join(STARTER, "vault-structure");
  if (fs.existsSync(structurePath)) {
    function walkDirs(dir) {
      for (const item of fs.readdirSync(dir)) {
        if (item === ".gitkeep" || item === ".git") continue;
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) {
          const rel = path.relative(structurePath, full);
          const target = path.join(vault, rel);
          if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
            console.log(`    ➕ Nouveau dossier : ${rel}`);
            dirsCreated++;
          }
          walkDirs(full);
        }
      }
    }
    walkDirs(structurePath);
  }
  console.log(`    ✅ Dossiers : ${dirsCreated} créés`);
  console.log("");

  // 5. Vault Settings (jamais écrasé)
  console.log("  [5/6] Vérification du Vault Settings...");
  const vsTarget = path.join(vault, "07 - Config", "Vault Settings.md");
  if (!fs.existsSync(vsTarget)) {
    fs.copyFileSync(path.join(STARTER, "Vault Settings.md"), vsTarget);
    console.log("    ➕ Vault Settings créé (nouveau)");
  } else {
    console.log("    ⏭️  Vault Settings existant (non écrasé — tes toggles sont préservés)");
  }
  console.log("");

  // 6. Documentation (toujours mise à jour)
  console.log("  [6/6] Mise à jour de la documentation...");
  fs.copyFileSync(
    path.join(STARTER, "Documentation Vault.md"),
    path.join(vault, "07 - Config", "Documentation Vault.md")
  );
  console.log("    ✅ Documentation mise à jour");
  console.log("");

  // Résumé
  console.log("  ════════════════════════════════════════════════");
  console.log("  ✅ Mise à jour terminée !");
  console.log("  ════════════════════════════════════════════════");
  console.log("");
  console.log(`  Templates : ${tAdded} ajoutés, ${tUpdated} mis à jour`);
  console.log(`  Scripts   : ${sAdded} ajoutés, ${sUpdated} mis à jour`);
  console.log(`  Dossiers  : ${dirsCreated} créés`);
  console.log("");
  console.log("  ⚠️  Le Vault Settings n'est JAMAIS écrasé pour préserver tes toggles.");
  console.log("  Si de nouveaux modules ont été ajoutés au starter pack,");
  console.log("  ajoute-les manuellement dans le frontmatter de Vault Settings.md.");
  console.log("");

  rl.close();
}

main().catch((e) => { console.error(e); rl.close(); });
