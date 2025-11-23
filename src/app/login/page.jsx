"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccess("Account created successfully Please sign in.")
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/login", {
        method,
        headers,
        body, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error))
        setError(data.error || "Invalid email or password")
        return
      }

      setSuccess("Login successful Redirecting...")
      await refresh()
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error) {
      console.error("Login error, error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    
      
        
          Work Order System
        
        
        
          
            
              Email
            
             setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="you@example.com"
              suppressHydrationWarning
            />
          

          
            
              Password
            
            
               setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus="••••••••"
                suppressHydrationWarning
              />
               setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              
            
            
              
              {error}
            
          )}

          {success && (
            
              {success}
            
          )}

          
          Demo users="mt-2">Call Center="bg-gray-100 px-2 py-1 rounded">callcenter@demo.com
          Manager="bg-gray-100 px-2 py-1 rounded">manager@demo.com
          Field Worker="bg-gray-100 px-2 py-1 rounded">worker@demo.com
          Password for all="bg-gray-100 px-2 py-1 rounded">password123
        

        
          
            Don't have an account?{" "}
            Loading...}>
      
    
  )
}
