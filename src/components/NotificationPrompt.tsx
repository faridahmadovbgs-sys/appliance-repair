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
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl p-4 border-2 border-green-500 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Enable Notifications</h3>
          <p className="text-sm text-gray-600 mb-3">
            Get instant updates when work orders are assigned or updated.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnable}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
