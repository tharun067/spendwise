// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider,GithubAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB3MU-t46O-9ctLPZ6GOw4MC420-OPq48",
  authDomain: "spendwise-c0533.firebaseapp.com",
  projectId: "spendwise-c0533",
  storageBucket: "spendwise-c0533.firebasestorage.app",
  messagingSenderId: "57785443823",
  appId: "1:57785443823:web:753712ef3f5ddfbf1b821a",
  measurementId: "G-7N3VQGGNZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();
const providerGithub = new GithubAuthProvider();
export { db, auth, provider, doc, setDoc, providerFacebook, providerGithub};