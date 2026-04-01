---
type: environment
project: <% await tp.system.suggester(["🏢 Projet-A", "🏢 Projet-B", "🏠 Projet-Perso"], ["Projet-A", "Projet-B", "Projet-Perso"]) %>
env_type: <% await tp.system.suggester(["💻 Local — Machine de dev", "🟢 DEV — Environnement de développement", "🟣 STG — Staging / pré-production", "🔴 PROD — Production"], ["local", "dev", "stg", "prod"]) %>
tags: [environment]
---

# ⚙️ `= this.project` — Environnement `= this.env_type`

---

## 🏗️ Stack

| Composant | Technologie | Version |
|-----------|------------|---------|
| Frontend | | |
| Backend | | |
| Database | | |

---

## 🚀 Démarrage

```bash
# Commandes pour lancer l'environnement
```

---

## 🔑 Variables d'environnement

| Variable | Valeur | Description |
|----------|--------|-------------|
| | | |

---

## 🌐 URLs & Ports

| Service | URL | Port |
|---------|-----|------|
| | | |

---

## 📝 Notes spécifiques

>
