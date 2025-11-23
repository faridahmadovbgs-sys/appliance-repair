"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type AuthUser = {
  id= {
  user) => Promise
  logout) => Promise
}

const AuthContext = createContext(undefined)

export function AuthProvider({ children }: { children) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/me", {
        method,
        credentials,
        cache,
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to load user", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method)
    } catch (error) {
      console.error("Failed to logout", error)
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    refresh,
    logout,
  }), [user, loading, loadUser, logout])

  return {children}
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { AuthUser }
