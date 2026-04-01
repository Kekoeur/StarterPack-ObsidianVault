---
type: doc
tags: [doc, guide, sharing]
---

# 📤 Partager le Vault — Guide

> Comment partager, contribuer, et synchroniser le Starter Kit.

---

## Option 1 : Cloner le repo GitHub (recommandé)

Le starter pack est hébergé sur GitHub. C'est la méthode la plus simple et la plus maintenable.

### Installation

```bash
# Cloner le repo
git clone https://github.com/Kekoeur/StarterPack-ObsidianVault.git

# Ouvrir Obsidian → créer un nouveau vault
# Copier le contenu du repo dans le vault
# Suivre le README.md
```

### Ce qui est inclus

- 18 templates génériques (sans données perso)
- 7 scripts QuickAdd (avec projets placeholder)
- Config Obsidian de référence
- Page de paramétrage (Vault Settings)
- Documentation complète du système

---

## Option 2 : Lier le repo à ton vault (junction)

Pour voir le starter pack directement dans ton vault Obsidian et synchroniser dans les deux sens.

### Setup (Windows)

```powershell
# 1. Cloner le repo quelque part sur ton PC
git clone https://github.com/Kekoeur/StarterPack-ObsidianVault.git C:\Users\MOI\Documents\StarterPack-ObsidianVault

# 2. Supprimer le dossier 08 - Starter Kit dans le vault s'il existe
Remove-Item "C:\Users\MOI\Documents\MonVault\08 - Starter Kit" -Recurse -Force

# 3. Créer le junction (lien symbolique)
cmd /c mklink /J "C:\Users\MOI\Documents\MonVault\08 - Starter Kit" "C:\Users\MOI\Documents\StarterPack-ObsidianVault"
```

### Setup (macOS / Linux)

```bash
# 1. Cloner le repo
git clone https://github.com/Kekoeur/StarterPack-ObsidianVault.git ~/Documents/StarterPack-ObsidianVault

# 2. Supprimer le dossier existant
rm -rf ~/Documents/MonVault/08\ -\ Starter\ Kit

# 3. Créer le symlink
ln -s ~/Documents/StarterPack-ObsidianVault ~/Documents/MonVault/08\ -\ Starter\ Kit
```

### Résultat

- `08 - Starter Kit/` dans ton vault pointe vers le repo Git
- Toute modification dans l'un est visible dans l'autre instantanément
- Tu peux naviguer dans le starter kit depuis Obsidian normalement

---

## Synchroniser les changements

### Récupérer les mises à jour (pull)

Quand quelqu'un a poussé des améliorations sur le repo :

```bash
cd C:\Users\MOI\Documents\StarterPack-ObsidianVault
git pull
```

Les fichiers sont mis à jour dans ton vault instantanément via le junction.

### Pousser tes modifications (push)

Si tu as modifié des templates ou scripts dans ton vault et que tu veux les partager :

```bash
cd C:\Users\MOI\Documents\StarterPack-ObsidianVault
git add -A
git commit -m "feat: description de la modification"
git push
```

### Synchroniser les templates périodiques

Les templates Daily, Weekly, Monthly, Quarterly vivent dans `06 - Templates/` de ton vault (pas dans le starter kit). Si tu les modifies et veux mettre à jour le starter kit :

```bash
# Copier les templates mis à jour vers le repo
copy "06 - Templates\Daily.md" "08 - Starter Kit\templates\Daily.md"
copy "06 - Templates\Weekly.md" "08 - Starter Kit\templates\Weekly.md"
copy "06 - Templates\Monthly.md" "08 - Starter Kit\templates\Monthly.md"
copy "06 - Templates\Quarterly.md" "08 - Starter Kit\templates\Quarterly.md"

# Puis commit + push depuis le repo
cd C:\Users\MOI\Documents\StarterPack-ObsidianVault
git add -A
git commit -m "feat: mise à jour templates périodiques"
git push
```

Ou utiliser le script `07 - Config/scripts/sync-starterpack.bat` qui fait tout ça automatiquement.

---

## Contribuer au Starter Pack

### Via Pull Request (recommandé)

```bash
# 1. Fork le repo sur GitHub
# 2. Clone ton fork
git clone https://github.com/TON-USER/StarterPack-ObsidianVault.git

# 3. Crée une branche
git checkout -b feat/mon-amelioration

# 4. Fais tes modifications
# 5. Commit et push
git add -A
git commit -m "feat: description"
git push origin feat/mon-amelioration

# 6. Ouvre une Pull Request sur GitHub
```

### Directement (si tu as les droits)

```bash
cd C:\Users\MOI\Documents\StarterPack-ObsidianVault
git add -A
git commit -m "feat: description"
git push
```

---

## Option 3 : Copie simple (sans Git)

Pour un partage ponctuel sans synchronisation.

1. Copier le dossier `08 - Starter Kit/` sur une clé USB ou par email
2. Le collègue copie le contenu dans son vault
3. Il suit le `README.md` étape par étape

---

## Option 4 : Obsidian Publish (lecture seule)

Pour publier la documentation en ligne (payant : ~8$/mois).

1. Settings → Core plugins → Activer "Publish"
2. `Ctrl+P` → "Publish: Publish changes"
3. Sélectionner les fichiers à publier

⚠️ Ne jamais publier : notes personnelles, tokens/secrets, contacts.

---

## Résumé

| Méthode | Effort | Sync | Collaboration |
|---------|--------|------|---------------|
| Repo GitHub + junction | Moyen | ✅ Bidirectionnelle | ✅ Pull Requests |
| Repo GitHub (clone simple) | Faible | ✅ Pull uniquement | ✅ Pull Requests |
| Copie simple | Faible | ❌ Ponctuel | ❌ |
| Obsidian Publish | Faible | ❌ Lecture seule | ❌ |
