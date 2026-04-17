
#!/bin/bash

FILE=android/app/build.gradle

# increment versionCode
CODE=$(grep versionCode $FILE | awk '{print $2}')
NEW_CODE=$((CODE+1))

# increment versionName (patch version)
NAME=$(grep versionName $FILE | awk -F\" '{print $2}')
IFS='.' read -r MAJOR MINOR PATCH <<< "$NAME"
PATCH=$((PATCH+1))
NEW_NAME="$MAJOR.$MINOR.$PATCH"

# replace values
sed -i "s/versionCode $CODE/versionCode $NEW_CODE/" $FILE
sed -i "s/versionName \"$NAME\"/versionName \"$NEW_NAME\"/" $FILE

echo "Updated to versionCode=$NEW_CODE, versionName=$NEW_NAME"
chmod +x bump-version.sh
