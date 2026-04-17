#!/bin/bash
cd /workspaces/My-app
npm run build
npx cap sync android
find /workspaces/My-app/android -name "*.gradle" -exec sed -i 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' {} \;
cd android && ./gradlew assembleDebug
