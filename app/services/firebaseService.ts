import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export const getCollection = async (collectionName: string) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
  });
};

export const getDocument = async (collectionName: string, documentId: string) => {
  const snapshot = await db.collection(collectionName).doc(documentId).get();
  const documentData = snapshot.data();
  if (documentData) {
      documentData.id = snapshot.id;
  }
  return documentData;
};

export const createDocument = async (collectionName: string, data: any) => {
  const docRef = await db.collection(collectionName).add(data);
  return docRef.id;
};

export const createDocumentWithID = async (collectionName: string, data: any, documentId: string) => {
  const docRef = db.collection(collectionName).doc(documentId);
  await docRef.set(data);
  return documentId;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  await db.collection(collectionName).doc(id).update(data);
  return id;
};

export const deleteDocument = async (collectionName: string, id: string) => {
  await db.collection(collectionName).doc(id).delete();
  return id;
};

export const documentExists = async (collectionName: string, documentId: string) => {
  const documentData = await getDocument(collectionName, documentId);
  return documentData !== undefined;
}

export const getUserInfos = async (userID: string) => {
  const userInfo = await getDocument('users', userID);
}

// Register a new user with email and password with error handling
export const registerWithEmailPassword = async (name: string, email: string, password: string) => {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    if (result.user) {
      await result.user.updateProfile({
        displayName: name
      });
    }
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Error registering new user:", error);
    return { success: false, error: error.message };
  }
};

// Sign in with email and password with error handling
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    return { success: false, error: error.message };
  }
};

// Sign in with Google with error handling
export const loginWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Error logging in with Google:", error);
    return { success: false, error: error.message };
  }
};

// Sign in with GitHub with error handling
export const loginWithGitHub = async () => {
  try {
    const provider = new firebase.auth.GithubAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Error logging in with GitHub:", error);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    console.log('User successfully signed out.');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error; // Rethrow the error to handle it in the calling code if necessary
  }
};

export const getCurrentUserAndDocument = async () => {
  firebase.auth().currentUser?.reload();
  const currentUser = firebase.auth().currentUser;
  
  if (!currentUser) {
    console.log('No user is currently logged in.');
    return null; 
  }

  try {
    const userDocument = await getDocument('users', currentUser.uid);

    if (!userDocument) {
      console.log('User document does not exist.');
      return currentUser;
    }

    const mergedUserData = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      ...userDocument
    };

    return mergedUserData;

  } catch (error) {
    console.error("Error fetching user document with getDocument:", error);
    return null; 
  }
};