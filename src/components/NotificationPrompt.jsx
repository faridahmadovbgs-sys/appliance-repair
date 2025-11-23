"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const { permission, requestPermission, isEnabled } = useNotifications()

  useEffect(() => {
    // Only show prompt if Firebase is enabled
    if (!isEnabled) return

    // Show prompt if permission is default and user is logged in
    const timer = setTimeout(() => {
      if (permission === "default") {
        setShowPrompt(true)
      }
    }, 5000) // Show after 5 seconds

    return () => clearTimeout(timer)
  }, [permission, isEnabled])

  const handleEnable = async () => {
    await requestPermission()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt || permission !== "default" || !isEnabled) return null

  return (
    
        
          
            
          
        
        
          Enable Notifications
          
            Get instant updates when work orders are assigned or updated.
          
          
            <button
              onClick={handleEnable}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover={handleDismiss}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover)
}
