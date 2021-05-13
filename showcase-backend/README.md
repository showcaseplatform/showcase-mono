<h1> SHOWCASE BACKEND</h1>

# Before starting

## Install firebase CLI

npm install -g firebase-tools

# Select dev or prod firebase project

firebase use dev / prod

# Start server with access to deployed dev environment

npm install
npm build
npm run serve

# Start server with local firestore/auth/functions emulators

npm install
npm run start-emulators

# Command to export prod firestore db

npm install -g node-firestore-import-export
firestore-export -a ./showcase-app-key.json -b ./seed.json -p

# Command to import dev firestore db

firestore-import -a ./showcase-dev-key.json -b ./seed.json

# Set up local firebase environment variable:

## Windows:

$env:GOOGLE_APPLICATION_CREDENTIALS=".showcase-dev-key.json"

## Linux / macOS:

export GOOGLE_APPLICATION_CREDENTIALS="./service-account-file.json"

# Deploy all function

firebase deploy --only functions

# Deploy single function

firebase deploy --only functions:<function-name>
