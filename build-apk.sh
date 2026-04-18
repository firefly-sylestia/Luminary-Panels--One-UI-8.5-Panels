#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
cd /workspaces/My-app
npm run build
npx cap sync android

# Patch all Java/Kotlin version references in capacitor plugins
find /workspaces/My-app/node_modules/@capacitor -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmTarget = "21"/jvmTarget = "17"/g' \
  -e "s/jvmTarget = '21'/jvmTarget = '17'/g" \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;
find /workspaces/My-app/android -name "*.gradle" -type f -exec sed -i \
  -e 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' \
  -e 's/jvmToolchain(21)/jvmToolchain(17)/g' {} \;

cd /workspaces/My-app/android && JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./gradlew assembleDebug
