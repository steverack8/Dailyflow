import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import app from "../config/firebase"

const db = getFirestore(app)

export async function saveDailyPlan(userId, plan, sourceData) {
  if (!userId) {
    throw new Error("ID pengguna wajib diisi.")
  }

  if (!plan) {
    throw new Error("Rencana wajib diisi.")
  }

  const plansRef = collection(db, "users", userId, "plans")

  const planData = {
    summary: plan.summary || "",
    schedule: plan.schedule || [],
    sourceData: sourceData || {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const document = await addDoc(plansRef, planData)

  return document.id
}

export async function getLatestDailyPlan(userId) {
  if (!userId) {
    throw new Error("ID pengguna wajib diisi.")
  }

  const plansRef = collection(db, "users", userId, "plans")

  const plansQuery = query(
    plansRef,
    orderBy("createdAt", "desc"),
    limit(1)
  )

  const snapshot = await getDocs(plansQuery)

  if (snapshot.empty) {
    return null
  }

  const document = snapshot.docs[0]

  return {
    id: document.id,
    ...document.data(),
  }
}

export async function updateDailyPlan(userId, planId, planData) {
  if (!userId) {
    throw new Error("ID pengguna wajib diisi.")
  }

  if (!planId) {
    throw new Error("ID rencana wajib diisi.")
  }

  if (!planData) {
    throw new Error("Data rencana wajib diisi.")
  }

  const planRef = doc(
    db,
    "users",
    userId,
    "plans",
    planId
  )

  await updateDoc(planRef, {
    ...planData,
    updatedAt: serverTimestamp(),
  })
}