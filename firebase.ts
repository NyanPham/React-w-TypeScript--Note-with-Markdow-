import { initializeApp } from 'firebase/app'
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth"

import { 
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc, 
} from 'firebase/firestore/lite'
import { Note, NoteData, RawNote, Tag } from './src/App'


// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
// }

const firebaseConfig = {
    apiKey: "AIzaSyD-O2D_4UEIj_AyPv5zKhuXaydygpH0rSA",
    authDomain: "note-with-markdown.firebaseapp.com",
    projectId: "note-with-markdown",
    storageBucket: "note-with-markdown.appspot.com",
    messagingSenderId:"847892647371",
    appId: "1:847892647371:web:21a11cff7b8c6d05c53a4e",
}

enum AuthProviderType {
    google,
    local
}

type User = {
    uid: string,
    name: string,
    authProvider: AuthProviderType, 
    email: string,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider)
        const user = res.user
        const q = query(collection(db, 'users'), where('uid', '==', user.uid))
        const docs = await getDocs(q)
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: AuthProviderType.google,
                email: user.email,
            })
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}


const getNotes = async (userId: string) => {
    const q = query(collection(db, 'notes'), where('userId', '==', userId))
    const noteSnapshot = await getDocs(q);
    const noteList = noteSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return noteList;
}

const addNoteDB = async(noteData: RawNote) => {
    try {
        await addDoc(collection(db, "notes"), noteData);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}

const getTags = async (userId: string) => {
    const q = query(collection(db, 'tags'), where('userId', '==', userId))
    const tagSnapshot = await getDocs(q);
    const tagList = tagSnapshot.docs.map(doc => ({ ...doc.data()}));
    return tagList;
}
    
const addTagDB = async (tag: Tag) => {
    try {
        await addDoc(collection(db, "tags"), tag);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}

const logInWIthEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user 
        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            name, 
            authProvider: AuthProviderType.local,
            email,
        })
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}

const sendPasswordReset = async(email: string) => {
    try {
        await sendPasswordResetEmail(auth, email)
        alert("Password reset link sent")
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            alert(err.message)
        }
    }
}

const logout = () => {
    signOut(auth)
}

export {
    auth,
    db,
    signInWithGoogle,
    logInWIthEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    getTags,
    getNotes,
    addNoteDB,
    addTagDB,
}