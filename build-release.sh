#!/bin/bash
set -e

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
export ANDROID_HOME=/workspaces/Luminary-Panels--One-UI-8.5-Panels/android-sdk

cd /workspaces/Luminary-Panels--One-UI-8.5-Panels

echo "🔨 Building web assets..."
npm run build

echo "📱 Syncing with Capacitor..."
npx cap sync android

echo "⚙️ Patching Gradle files..."
find /workspaces/Luminary-Panels--One-UI-8.5-Panels/node_modules/@capacitor /workspaces/Luminary-Panels--One-UI-8.5-Panels/node_modules/@capacitor-community -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmTarget = "21"/jvmTarget = "17"/g' \
  -e "s/jvmTarget = '21'/jvmTarget = '17'/g" \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;

find /workspaces/Luminary-Panels--One-UI-8.5-Panels/android -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;

echo "🔑 Building signed release APK..."
cd /workspaces/Luminary-Panels--One-UI-8.5-Panels/android

./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=/workspaces/Luminary-Panels--One-UI-8.5-Panels/android/luminary.keystore \
  -Pandroid.injected.signing.store.password=luminary123 \
  -Pandroid.injected.signing.key.alias=luminary_key \
  -Pandroid.injected.signing.key.password=luminary123

echo ""
echo "✅ Release APK built successfully!"
echo "📦 Renaming APK..."

# Find and rename the APK
APK_PATH=$(find /workspaces/Luminary-Panels--One-UI-8.5-Panels/android -name "app-release.apk" 2>/dev/null | head -1)
if [ -n "$APK_PATH" ]; then
  NEW_NAME="Luminary-Panels-1.1.6-release.apk"
  cp "$APK_PATH" "/workspaces/Luminary-Panels--One-UI-8.5-Panels/$NEW_NAME"
  echo "✨ Final APK: /workspaces/Luminary-Panels--One-UI-8.5-Panels/$NEW_NAME"
  ls -lh "/workspaces/Luminary-Panels--One-UI-8.5-Panels/$NEW_NAME"
else
  echo "Could not find app-release.apk"
fi
