import {  createContext, useEffect, useState } from "react";
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register new user with email and password

    const signup = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                email,
                createdAt: serverTimestamp()
            });

            toast.success('Account created successfully');
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully');
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Check if this is a new user
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!userDoc.exists()) {
                // Create user document for new Google sign in
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    createdAt: serverTimestamp()
                });
            }

            toast.success('Logged in with Google successfully!');
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Sign in with Facebook
    const signInWithFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Check if this is a new user
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!userDoc.exists()) {
                // Create user document for new Google sign in
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    createdAt: serverTimestamp()
                });
            }

            toast.success('Logged in with Facebook successfully!');
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Sign in with Github
    const signInWithGithub = async () => {
        try {
            const provider = new GithubAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Check if this is a new user
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!userDoc.exists()) {
                // Create user document for new Google sign in
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    createdAt: serverTimestamp()
                });
            }

            toast.success('Logged in with Google successfully!');
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Observer for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [])
    
    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle,
        signInWithFacebook,
        signInWithGithub
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};