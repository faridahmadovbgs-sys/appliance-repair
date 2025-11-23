"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt) => Promise
  userChoice) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e )
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if already installed
    if (window.matchMedia("(display-mode)").matches) {
      setShowInstallPrompt(false)
    }

    // Check for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setShowUpdatePrompt(true)
              }
            })
          }
        })
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload()
      })
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  const handleRefresh = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type)
    }
  }

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  if (!showInstallPrompt && !showUpdatePrompt) return null

  return (
    <>
      {showUpdatePrompt && (
        
            
              
                
              
            
            
              Update Available
              
                A new version is available. Refresh to get the latest features and fixes.
              
              
                
            
              
                
              
            
            
              Install Work Orders App
              
                Install this app on your phone for quick access and offline functionality.
              
              
                
  )
}
