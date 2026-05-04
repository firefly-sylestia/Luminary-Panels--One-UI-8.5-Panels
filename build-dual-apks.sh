#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
OUT_DIR="$ROOT_DIR/release-apks"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build
npx cap sync android

cd "$ANDROID_DIR"
./gradlew :app:assembleWebRelease :app:assembleNativeRelease

cp app/build/outputs/apk/web/release/app-web-release.apk "$OUT_DIR/Luminary-Panels-web-3.0.1.apk"
cp app/build/outputs/apk/native/release/app-native-release.apk "$OUT_DIR/Luminary-Panels-native-3.0.1.apk"

echo "Built APKs:"
echo "- $OUT_DIR/Luminary-Panels-web-3.0.1.apk"
echo "- $OUT_DIR/Luminary-Panels-native-3.0.1.apk"
