import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';
import { getFirestore, Firestore } from 'firebase/firestore';

interface Config {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

const firebaseConfig: Config = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (getApps().length > 0) {
  app = getApps()[0]; // Use the already initialized app
} else {
  app = initializeApp(firebaseConfig); // Initialize a new app
}

const auth: Auth = getAuth(app);
const functions: Functions = getFunctions(app);
const firestore: Firestore = getFirestore(app);

export { auth, functions, firestore };
