# MCU Viewing Order

A clean, modern Marvel Cinematic Universe (MCU) viewing-order tracker.
Browse all films, series, and shorts across Phases 1–6 in the proper
chronological watch order, mark what you have seen, filter by type or
essential/optional, and keep your progress saved locally.

The app ships as both a web app (Vite + React) and a native Android app
(Capacitor).

---

## Features

- Complete chronological viewing order across MCU Phases 1–6
- Filter by film, series, or short
- Filter to essentials only or already-watched only
- Search by title or prerequisite
- Sort chronological, by year, or alphabetical
- Per-phase progress bars and overall completion percentage
- Progress saved automatically to local storage
- Premium dark UI with smooth, GPU-accelerated animations
- Native Android build via Capacitor

---

## Development

```bash
npm install
npm run dev
```

## Build the web bundle

```bash
npm run build
```

## Build the Android APK

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

The signed release variant uses `build-release.sh`.

---

## App identity

| Field          | Value                          |
| -------------- | ------------------------------ |
| App name       | MCU Viewing Order              |
| Package / appId| `com.mcuviewingorder.app`      |
| Web title      | MCU Viewing Order              |
