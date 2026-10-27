# Red Room Nails

Appointment and client manager for a nail studio. Built with Expo SDK 58, React Native, TypeScript, Expo Router and styled-components.

## Requirements

- Node.js 22+
- Expo Go on an iPhone (login required)
- A Firebase project for cloud backup (Phase 5)

## Setup

```bash
npm install
cp .env.example .env
npx expo start
```

Fill `.env` with the Firebase web app config values. The app runs without them; sign-in and sync stay disabled until they are set.

## Scripts

```bash
npx expo start        # dev server
npx expo lint         # ESLint
npx tsc --noEmit      # typecheck
npx expo-doctor       # dependency and config checks
```

## Structure

```
src/
  app/                 # Expo Router routes
    (tabs)/            # Today, Calendar, Clients, Settings
    appointment/       # New / edit appointment modals
    client/            # New / edit client modals
  components/ui/       # Screen, AppText, Button, Card, Input, EmptyState, Fab
  i18n/                # i18next setup, bg/en locales
  services/            # Firebase app, auth, Firestore
  store/               # Zustand stores (settings, later appointments/clients)
  theme/               # Design tokens and styled-components provider
  types/               # Domain models
  utils/               # Date helpers
firestore.rules        # Per-user access rules
firebase.json          # Firebase CLI config
```

## Roadmap

1. Local appointment and client stores (Zustand + AsyncStorage)
2. Today, Calendar and Clients screens with forms
3. Firebase email/password auth and last-write-wins sync
4. JSON export/import backup
5. EAS Build, TestFlight and App Store release
