"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email,
    organization,
    firstName,
    lastName,
    password,
    confirmPassword,
    role)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.email || !formData.organization || !formData.firstName || 
        !formData.lastName || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length 
      
        
          Create Account
          Join your organization's work order system
        

        
          {error && (
            
              {error}
            
          )}

          
            
              Email Address
            
             setFormData({ ...formData, email)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="you@company.com"
              required
            />
          

          
            
              Organization Name
            
             setFormData({ ...formData, organization)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="ABC Repairs Inc"
              required
            />
          

          
            
              
                First Name
              
               setFormData({ ...formData, firstName)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="John"
                required
              />
            

            
              
                Last Name
              
               setFormData({ ...formData, lastName)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="Doe"
                required
              />
            
          

          
            
              Role
            
             setFormData({ ...formData, role)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus="FIELD_WORKER">Field Worker
              Call Center
              Manager
            
          

          
            
              Password
            
            
               setFormData({ ...formData, password)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus="••••••••"
                required
                minLength={8}
              />
               setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover="http="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    
                  
                )
                  
                    
                    
                  
                )}
              
            
          

          
            
              Confirm Password
            
            
               setFormData({ ...formData, confirmPassword)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus="••••••••"
                required
                minLength={8}
              />
               setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover="http="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    
                  
                )
                  
                    
                    
                  
                )}
              
            
          

          
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover)
}
