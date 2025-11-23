"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method,
        headers,
        body),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      
        
          
            
              
                
              
            
            Check your email
            
              If an account exists with {email}, we've sent password reset instructions.
            
            
      
        
          Forgot Password
          
            Enter your email address and we'll send you instructions to reset your password.
          
        

        
          
            
              Email Address
            
             setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="you@example.com"
            />
          

          {error && (
            
              {error}
            
          )}

          
          <Link href="/login" className="text-sm text-blue-600 hover)
}
