# SalesConnect Mobile - Application Terrain REP

Application React Native (Expo SDK 56) pour les commerciaux terrain.

## Fonctionnalites

- **Route du jour** : Liste des visites planifiees
- **Visite** : Check-in/out GPS, gestion des visites clients
- **Commande** : Prise de commande avec panier
- **Merchandising** : Capture photo rayon
- **Profil** : Informations utilisateur et deconnexion

## Prerequis

- Node.js >= 18
- npm ou yarn
- Expo Go sur votre telephone (iOS/Android)
  - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android : [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation

```bash
cd mobile
npm install
```

## Configuration

Creez un fichier `.env` a la racine du dossier `mobile/` :

```env
EXPO_PUBLIC_API_URL=https://backendsfa-gdqw.onrender.com/api
EXPO_PUBLIC_TENANT_ID=votre-tenant-uuid-ici
```

> Le tenant ID est optionnel dans `.env` - l'app permet de le selectionner a l'ecran de login.

## Lancement

### Mode Developpement (recommande)

```bash
npx expo start
```

Cela affiche un QR code dans le terminal. Scannez-le :
- **iOS** : Ouvrez l'app Camera et scannez le QR code
- **Android** : Ouvrez Expo Go et scannez le QR code

### Autres options de lancement

```bash
# Lancer sur simulateur iOS (Mac uniquement, necessite Xcode)
npx expo start --ios

# Lancer sur emulateur Android (necessite Android Studio)
npx expo start --android

# Mode tunnel (si le QR code ne fonctionne pas sur le meme reseau)
npx expo start --tunnel
```

## Connexion

1. Selectionnez votre **organisation** (chargee automatiquement depuis le backend)
2. Entrez votre **email** et **mot de passe**
3. L'app vous redirige vers le dashboard avec vos visites du jour

### Compte de test

```
Organisation: Fan Milk International
Email: manager.fanmilk@salesconnected.ci
Mot de passe: Salesconnected2026
```

## Structure du Projet

```
mobile/
├── src/
│   ├── app/              # Routes (expo-router file-based)
│   │   ├── (auth)/       # Pages authentification
│   │   │   └── login.tsx
│   │   ├── (tabs)/       # Pages principales (onglets)
│   │   │   ├── index.tsx         # Route du jour
│   │   │   ├── visit.tsx         # Visite
│   │   │   ├── order.tsx         # Commande
│   │   │   ├── merchandising.tsx # Photo merchandising
│   │   │   └── profile.tsx       # Profil
│   │   └── _layout.tsx   # Layout racine
│   ├── constants/        # Theme, couleurs, config
│   ├── services/         # API client, auth, etc.
│   └── types/            # Types TypeScript
├── app.json              # Config Expo
├── package.json
└── tsconfig.json
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npx expo start` | Demarre le serveur de dev |
| `npx expo start --tunnel` | Demarre avec tunnel (reseau different) |
| `npx tsc --noEmit` | Verification TypeScript |
| `npx expo export` | Build production |

## Architecture API

L'app se connecte au backend NestJS multi-tenant :
- **URL** : `https://backendsfa-gdqw.onrender.com/api`
- **Header** : `X-Tenant-ID` envoye sur toutes les requetes
- **Auth** : JWT (access_token + refresh_token stockes dans AsyncStorage)
