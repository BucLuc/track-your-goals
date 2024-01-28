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