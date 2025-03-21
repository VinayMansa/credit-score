import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv3WaDwIV3hE7kUAoFQSQyF38Uq1WcvjE",
  authDomain: "task-buddy-74129.firebaseapp.com",
  projectId: "task-buddy-74129",
  storageBucket: "task-buddy-74129.firebasestorage.app",
  messagingSenderId: "567329183607",
  appId: "1:567329183607:web:19c6de952b85d9cbbb3372",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
