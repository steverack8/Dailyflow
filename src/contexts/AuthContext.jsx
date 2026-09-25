import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { auth } from "../config/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(
      auth,
      provider
    )

    setUser(result.user)

    return result.user
  }

  async function logout() {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      logout,
    }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider."
    )
  }

  return context
}