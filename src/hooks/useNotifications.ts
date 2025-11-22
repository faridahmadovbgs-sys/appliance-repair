"use client"

import { useEffect, useState } from "react"
import { getMessagingInstance, isFirebaseEnabled } from "@/lib/firebase"
import { getToken, onMessage } from "firebase/messaging"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isFirebaseEnabled) {
      console.log("Firebase not configured - notifications disabled")
      return null
    }

    try {
      const messaging = await getMessagingInstance()
      if (!messaging) {
        console.log("Messaging not supported")
        return null
      }

      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        if (!vapidKey) {
          console.warn("VAPID key not configured")
          return null
        }
        
        const currentToken = await getToken(messaging, { vapidKey })
        
        if (currentToken) {
          setToken(currentToken)
          // TODO: Send token to server to save in database
          console.log("FCM Token:", currentToken)
          return currentToken
        }
      }
    } catch (error) {
      console.error("Error getting notification permission:", error)
    }
    return null
  }

  const setupMessageListener = async () => {
    if (!isFirebaseEnabled) {
      return
    }

    try {
      const messaging = await getMessagingInstance()
      if (!messaging) return

      onMessage(messaging, (payload) => {
        console.log("Message received:", payload)
        
        // Show notification
        if (payload.notification) {
          new Notification(payload.notification.title || "Work Order Update", {
            body: payload.notification.body,
            icon: "/icon-192x192.png",
          })
        }
      })
    } catch (error) {
      console.error("Error setting up message listener:", error)
    }
  }

  return {
    permission,
    token,
    requestPermission,
    setupMessageListener,
    isEnabled: isFirebaseEnabled,
  }
}
