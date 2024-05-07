import {initializeApp, getApps, getApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore, doc, collection, getDoc, addDoc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app);

async function getDocument(collection : string, id: string) {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()){
    return { id, ...docSnap.data() };
  }
  return undefined
}

async function addDocument(collectionName: string, data: object) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; 
  } catch (e) {
    console.error("Error adding document: ", e);
    return null; 
  }
}

async function setDocument(collectionName: string, id: string, data: object){
  try {
    await setDoc(doc(db, collectionName, id), data)
  } catch (e){
    console.error(e)
  }
}


async function checkForUserDetailOrCreate(response: any) {
  const user = response.user
  const userData = await getDocument('users', user.uid)
  if (!userData) {
      await setDocument('users', response.user.uid, { 'displayName': user.displayName, 'email': user.email })
  }
}

export {app, auth, getDocument, addDocument, setDocument, checkForUserDetailOrCreate}