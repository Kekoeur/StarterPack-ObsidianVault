---
type: doc
tags: [doc, guide, sharing]
---

# 📤 Partager le Vault — Guide

> Comment partager ton vault ou le Starter Kit avec un collègue.

---

## Option 1 : Partager le Starter Kit (recommandé)

Le plus simple. Le collègue repart de zéro avec un vault propre.

### Étapes

1. Copier le dossier `08 - Starter Kit/` sur une clé USB, par email, ou via un repo Git
2. Le collègue suit le `README.md` étape par étape (~10 min)
3. Il adapte `git-helpers.js` avec ses propres projets et chemins locaux

### Ce qui est inclus

- 11 templates génériques (sans données perso)
- 4 scripts QuickAdd (avec projets placeholder)
- Config Obsidian de référence
- Documentation complète du système

---

## Option 2 : Repo Git partagé (équipe)

Pour une équipe qui veut partager les templates et scripts tout en gardant ses notes perso.

### Setup initial

```bash
# Créer le repo
cd "chemin/vers/vault"
git init
```

### .gitignore recommandé

```gitignore
# Notes personnelles — NE PAS COMMITER
04 - Journal/
01 - Projects/
02 - Areas/
03 - Resources/Contacts/
03 - Resources/Médical/
05 - Archive/
07 - Config/cache/

# Obsidian workspace (spécifique à chaque machine)
.obsidian/workspace.json
.obsidian/workspace-mobile.json

# Secrets
.obsidian-secrets/

# OS
.DS_Store
Thumbs.db
```

### Ce qui est versionné

```
✅ 00 - Dashboard/          → Pages d'accueil (partagées)
✅ 06 - Templates/          → Templates (partagés)
✅ 07 - Config/scripts/     → Scripts QuickAdd (partagés)
✅ 07 - Config/*.md         → Documentation config (partagée)
✅ 08 - Starter Kit/        → Kit de démarrage
✅ 03 - Resources/*.md      → Cheatsheets, guides (partagés)
✅ Home.md                  → Page d'accueil
```

### Workflow Git

```bash
# Quand tu modifies un template ou script
git add 06\ -\ Templates/ 07\ -\ Config/scripts/
git commit -m "feat: amélioration template Branch"
git push

# Quand un collègue veut récupérer les changements
git pull
```

---

## Option 3 : Obsidian Publish (lecture seule)

Pour publier la documentation en ligne (payant : ~8$/mois).

### Setup

1. Settings → Core plugins → Activer "Publish"
2. `Ctrl+P` → "Publish: Publish changes"
3. Sélectionner les fichiers à publier :
   - `08 - Starter Kit/Documentation Vault.md`
   - `08 - Starter Kit/README.md`
   - `03 - Resources/Guide Obsidian.md`
   - `03 - Resources/Obsidian Cheatsheet.md`

### ⚠️ Ne jamais publier

- Notes personnelles (Journal, Projects)
- Fichiers de config avec tokens/secrets
- Notes de contacts

---

## Option 4 : Export Markdown simple

Pour un partage ponctuel sans Git.

### Script d'export

```bash
# Windows (PowerShell)
$dest = "$env:USERPROFILE\Desktop\Vault-Export"
New-Item -ItemType Directory -Force -Path $dest

Copy-Item "06 - Templates\*" "$dest\templates\" -Recurse
Copy-Item "07 - Config\scripts\*" "$dest\scripts\" -Recurse
Copy-Item "08 - Starter Kit\*" "$dest\starter-kit\" -Recurse
Copy-Item "Home.md" "$dest\"
Copy-Item "00 - Dashboard\Dashboard.md" "$dest\"

Write-Host "✅ Export terminé dans $dest"
```

```bash
# macOS / Linux
dest=~/Desktop/Vault-Export
mkdir -p "$dest"/{templates,scripts,starter-kit}

cp "06 - Templates/"* "$dest/templates/"
cp "07 - Config/scripts/"* "$dest/scripts/"
cp -r "08 - Starter Kit/"* "$dest/starter-kit/"
cp Home.md "$dest/"
cp "00 - Dashboard/Dashboard.md" "$dest/"

echo "✅ Export terminé dans $dest"
```

---

## Résumé

| Méthode | Effort | Coût | Temps réel |
|---------|--------|------|------------|
| Starter Kit (copie) | Faible | Gratuit | Ponctuel |
| Repo Git partagé | Moyen | Gratuit | Continu |
| Obsidian Publish | Faible | ~8$/mois | Continu |
| Export Markdown | Faible | Gratuit | Ponctuel |
