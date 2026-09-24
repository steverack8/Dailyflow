import {
  addDoc,
  collection,
  deleteDoc,
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
    throw new Error("User ID is required.")
  }

  if (!plan) {
    throw new Error("Plan is required.")
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
    throw new Error("User ID is required.")
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
    throw new Error("User ID is required.")
  }

  if (!planId) {
    throw new Error("Plan ID is required.")
  }

  if (!planData) {
    throw new Error("Plan data is required.")
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

export async function deleteDailyPlan(userId, planId) {
  if (!userId) {
    throw new Error("User ID is required.")
  }

  if (!planId) {
    throw new Error("Plan ID is required.")
  }

  const planRef = doc(
    db,
    "users",
    userId,
    "plans",
    planId
  )

  await deleteDoc(planRef)
}