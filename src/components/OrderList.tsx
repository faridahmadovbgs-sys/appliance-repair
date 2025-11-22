"use client"

import { useState } from "react"

type Order = {
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

type OrderListProps = {
  orders: Order[]
  userRole: string
  onUpdateOrder: (orderId: string, updates: any) => void
  onAssignOrder: (order: Order) => void
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
}

export default function OrderList({ orders, userRole, onUpdateOrder, onAssignOrder }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const formatServiceType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const canUpdateStatus = (order: Order) => {
    if (userRole === "MANAGER") return true
    if (userRole === "FIELD_WORKER" && order.assignedTo) return true
    return false
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    onUpdateOrder(orderId, { status: newStatus })
  }

  return (
    <div className="divide-y divide-gray-200">
      {orders.map((order) => (
        <div key={order.id} className="p-6 hover:bg-gray-50">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                  {order.status.replace(/_/g, " ")}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[order.priority]}`}>
                  {order.priority}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p className="text-blue-600">{formatServiceType(order.serviceType)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {userRole === "MANAGER" && !order.assignedTo && (
                <button
                  onClick={() => onAssignOrder(order)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Assign Worker
                </button>
              )}
              
              {canUpdateStatus(order) && order.status !== "COMPLETED" && (
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  {userRole === "MANAGER" && <option value="CANCELLED">Cancelled</option>}
                </select>
              )}

              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {expandedOrder === order.id ? "Hide Details" : "View Details"}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Address:</p>
                <p className="text-sm text-gray-600">{order.customerAddress}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-sm text-gray-600">{order.description}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created by:</span> {order.createdBy.name}
                </div>
                {order.assignedTo && (
                  <div>
                    <span className="font-medium">Assigned to:</span> {order.assignedTo.name}
                  </div>
                )}
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
