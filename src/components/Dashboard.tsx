"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import CreateOrderForm from "./CreateOrderForm"
import OrderList from "./OrderList"
import AssignOrderModal from "./AssignOrderModal"
import PWAInstallPrompt from "./PWAInstallPrompt"
import NotificationPrompt from "./NotificationPrompt"

type WorkOrder = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  serviceType: string
  description: string
  priority: string
  status: string
  notes?: string
  createdAt: string
  assignedTo?: { name: string; email: string }
  createdBy: { name: string; email: string }
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)

  const userRole = (session?.user as any)?.role

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/work-orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCreateOrder = async (orderData: any) => {
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (res.ok) {
        await fetchOrders()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Failed to create order:", error)
    }
  }

  const handleUpdateOrder = async (orderId: string, updates: any) => {
    try {
      const res = await fetch(`/api/work-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        await fetchOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Order Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                {session?.user?.name} • {userRole?.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        {(userRole === "CALL_CENTER" || userRole === "MANAGER") && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              {showCreateForm ? "Cancel" : "+ Create New Order"}
            </button>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <CreateOrderForm
              onSubmit={handleCreateOrder}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {userRole === "FIELD_WORKER" ? "My Assigned Orders" : "All Work Orders"}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found</div>
          ) : (
            <OrderList
              orders={orders}
              userRole={userRole}
              onUpdateOrder={handleUpdateOrder}
              onAssignOrder={setSelectedOrder}
            />
          )}
        </div>
      </main>

      {/* Assign Order Modal */}
      {selectedOrder && userRole === "MANAGER" && (
        <AssignOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssign={(workerId: string) => {
            handleUpdateOrder(selectedOrder.id, {
              assignedToId: workerId,
              status: "ASSIGNED",
            })
          }}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Notification Permission Prompt */}
      <NotificationPrompt />
    </div>
  )
}
