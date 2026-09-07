import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, limit, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

// ========== AUTH ==========
export async function signUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(cred.user, { displayName })
  }
  // Create user document
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    displayName: displayName || email.split('@')[0],
    plan: 'free',
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: 'inactive',
    messageCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Send welcome email (non-blocking)
  try {
    const { sendWelcomeEmail } = await import('./emailjs.js')
    await sendWelcomeEmail({
      toName: displayName || email.split('@')[0],
      toEmail: email,
      plan: 'free'
    })
  } catch (e) {
    console.warn('Welcome email failed (non-critical):', e.message)
  }

  return cred.user
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// ========== USER ==========
export async function getUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function updateUserPlan(uid, planData) {
  await updateDoc(doc(db, 'users', uid), {
    ...planData,
    updatedAt: serverTimestamp()
  })
}

// ========== CHATS / HISTORY ==========
export async function createChat(uid, title = 'New Chat') {
  const ref = await addDoc(collection(db, 'chats'), {
    userId: uid,
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return ref.id
}

export async function getUserChats(uid) {
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', uid),
    orderBy('updatedAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export function listenToUserChats(uid, callback) {
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', uid),
    orderBy('updatedAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const chats = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(chats)
  })
}

export async function addMessage(chatId, role, content, imageUrl = null) {
  const ref = await addDoc(collection(db, 'chats', chatId, 'messages'), {
    role,
    content,
    imageUrl,
    createdAt: serverTimestamp()
  })
  // Update chat timestamp
  await updateDoc(doc(db, 'chats', chatId), {
    updatedAt: serverTimestamp(),
    title: role === 'user' ? content.slice(0, 40) + (content.length > 40 ? '...' : '') : undefined
  })
  return ref.id
}

export async function getChatMessages(chatId) {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export function listenToMessages(chatId, callback) {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(messages)
  })
}

// ========== STRIPE CALLABLES (call your Cloud Functions) ==========
export const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession')
export const createPortalSession = httpsCallable(functions, 'createPortalSession')
