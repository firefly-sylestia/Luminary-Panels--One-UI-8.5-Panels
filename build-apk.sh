#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
cd /workspaces/Luminary-Panels--One-UI-8.5-Panels
npm run build
npx cap sync android

# Patch all Java/Kotlin version references in capacitor plugins
find /workspaces/Luminary-Panels--One-UI-8.5-Panels/node_modules/@capacitor /workspaces/Luminary-Panels--One-UI-8.5-Panels/node_modules/@capacitor-community -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmTarget = "21"/jvmTarget = "17"/g' \
  -e "s/jvmTarget = '21'/jvmTarget = '17'/g" \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;
find /workspaces/Luminary-Panels--One-UI-8.5-Panels/android -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;

cd /workspaces/Luminary-Panels--One-UI-8.5-Panels/android && ./gradlew assembleDebug
