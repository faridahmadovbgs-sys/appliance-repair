"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CreateOrderForm from "./CreateOrderForm"
import OrderList from "./OrderList"
import AssignOrderModal from "./AssignOrderModal"
import PWAInstallPrompt from "./PWAInstallPrompt"
import NotificationPrompt from "./NotificationPrompt"
import { useAuth } from "@/context/AuthContext"

type WorkOrder = {
  id) {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const userRole = user?.role

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [authLoading, user, router])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch("/api/work-orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders, error)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const handleCreateOrder = async (orderData) => {
    try {
      const res = await fetch("/api/work-orders", {
        method,
        headers,
        body),
      })

      if (res.ok) {
        await fetchOrders()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Failed to create order, error)
    }
  }

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const res = await fetch(`/api/work-orders/${orderId}`, {
        method,
        headers,
        body),
      })

      if (res.ok) {
        await fetchOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Failed to update order, error)
    }
  }

  return (
    
      {/* Header */}
      
        
            
              Work Order Management
              
                {user?.name} • {userRole?.replace("_", " ")} • {user?.organizationName}
              
            
            
              
                  
                
                History
              
               {
                  await logout()
                  router.replace("/login")
                }}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover="max-w-7xl mx-auto px-4 sm="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            Checking your access...
          
        )}

        {(userRole === "CALL_CENTER" || userRole === "MANAGER") && (
          
             setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover)}

        {/* Create Form */}
        {showCreateForm && (
          
             setShowCreateForm(false)}
            />
          
        )}

        {/* Orders List */}
        
          
            
              {userRole === "FIELD_WORKER" ? "My Assigned Orders" : "All Work Orders"}
            
          
          
          {ordersLoading ? (
            Loading orders...
          )=== 0 ? (
            No orders found
          )
            
          )}
        
      

      {/* Assign Order Modal */}
      {selectedOrder && userRole === "MANAGER" && (
         setSelectedOrder(null)}
          onAssign={(workerId) => {
            handleUpdateOrder(selectedOrder.id, {
              assignedToId,
              status,
            })
          }}
        />
      )}

      {/* PWA Install Prompt */}
      

      {/* Notification Permission Prompt */}
      
    
  )
}
