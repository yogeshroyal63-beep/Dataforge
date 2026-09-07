import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, hasFirebaseConfig } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(hasFirebaseConfig)

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = (email, password) => {
    if (!hasFirebaseConfig) return Promise.reject(new Error('demo-mode'))
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = (email, password) => {
    if (!hasFirebaseConfig) return Promise.reject(new Error('demo-mode'))
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signOut = () => {
    if (!hasFirebaseConfig) return Promise.resolve()
    return firebaseSignOut(auth)
  }

  const resetPassword = (email) => {
    if (!hasFirebaseConfig) return Promise.reject(new Error('demo-mode'))
    return sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, hasFirebaseConfig, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
