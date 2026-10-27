# Red Room Nails

Appointment and client manager for a nail studio. Built with Expo SDK 58, React Native, TypeScript, Expo Router and styled-components.

## Requirements

- Node.js 22+
- Expo Go on an iPhone, signed in to an Expo account
- A Firebase project for cloud backup (Phase 5)

## Setup

```bash
npm install
cp .env.example .env
npm run login
npm run start:tunnel
```

Log in once with `npm run login` (same account as Expo Go), then scan the QR code with Expo Go.

Fill `.env` with the Firebase web app config values. The app runs without them; sign-in and sync stay disabled until they are set.

## Corporate network

This machine is behind a firewall that blocks inbound connections and TLS 1.3 from Node. Two consequences:

- LAN mode (`npm start`) will hang on "Opening project" because the phone cannot reach the PC.
- Expo's API, login and tunnel fail until Node is forced to TLS 1.2.

The npm scripts already set `NODE_OPTIONS=--tls-max-v1.2`. Always use the scripts (or set that variable yourself) when running Expo commands. Use `npm run start:tunnel`, not `npm start`, on this network.

If a command still hangs, run it through the scripts or prefix it:

```powershell
$env:NODE_OPTIONS="--tls-max-v1.2"
npx expo <command>
```

## Scripts

```bash
npm run login         # Expo account login (browser)
npm run start:tunnel  # dev server over an Expo tunnel (works behind the firewall)
npm start             # dev server on the LAN (blocked on this network)
npm run web           # run in the browser on the PC
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run doctor        # dependency and config checks
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
