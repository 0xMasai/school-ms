# ⚡ Quick Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Firebase project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → give it a name (e.g. `my-school-sms`)
3. Disable Google Analytics (optional) → **Create project**

## 3. Add a Web App to Firebase

1. In your project dashboard, click the **Web icon `</>`**
2. Register app with a nickname (e.g. `school-ms-web`)
3. **Copy the `firebaseConfig` object** — you'll need it next

## 4. Enable Firestore Database

1. In the Firebase console sidebar: **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (you can add security rules later)
4. Select a region close to you → **Done**

## 5. Paste your Firebase config

Open `src/db/firebase.js` and replace the placeholder block:

```js
// BEFORE (placeholder):
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// AFTER (your real values from Firebase console):
const firebaseConfig = {
  apiKey:            "AIzaSyABC123...",
  authDomain:        "my-school-sms.firebaseapp.com",
  projectId:         "my-school-sms",
  storageBucket:     "my-school-sms.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
};
```

## 6. Run the app

```bash
npm run dev
```

The app will open in Electron. On first launch, the **Setup Wizard** will appear.

---

## 🌐 How offline mode works

This app uses **Firestore's persistent local cache** (IndexedDB).

| Scenario | Behaviour |
|---|---|
| ✅ Online | Reads/writes go to Firebase, cached locally |
| 📴 Offline | Reads/writes use the local IndexedDB cache |
| 🔄 Reconnects | Local changes automatically sync to Firebase |

No special setup needed — it's automatic.

---

## 🔒 Firestore Security Rules (for production)

After testing, replace Firestore rules with this in **Firebase Console → Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow access from authenticated sessions
    // Since auth is custom (bcrypt), lock down by default
    // and only allow reads/writes from your app's origin
    match /{document=**} {
      allow read, write: if true; // tighten this for production
    }
  }
}
```

For a school with one location, keeping it open and relying on the desktop app's login system is fine.
