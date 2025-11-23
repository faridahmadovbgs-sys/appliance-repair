"use client"

import { useState } from "react"

type Order = {
  id= {
  orders, updates) => void
  onAssignOrder) => void
}

const statusColors, string> = {
  PENDING,
  ASSIGNED,
  IN_PROGRESS,
  COMPLETED,
  CANCELLED,
}

const priorityColors, string> = {
  LOW,
  MEDIUM,
  HIGH,
  URGENT,
}

export default function OrderList({ orders, userRole, onUpdateOrder, onAssignOrder }) {
  const [expandedOrder, setExpandedOrder] = useState(null)

  const formatServiceType = (type) => {
    if (!type) return "N/A"
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const canUpdateStatus = (order) => {
    if (userRole === "MANAGER") return true
    if (userRole === "FIELD_WORKER" && order.assignedTo) return true
    return false
  }

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrder(orderId, { status)
  }

  return (
    
      {orders.map((order) => (
        
              
                {order.orderNumber}
                
                  {order.status.replace(/_/g, " ")}
                
                
                  {order.priority}
                
              
              
              
                {order.customerName}
                {order.customerPhone}
                {formatServiceType(order.serviceType)}
              
            

            {/* Actions */}
            
              {userRole === "MANAGER" && !order.assignedTo && (
                 onAssignOrder(order)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover)}
              
              {canUpdateStatus(order) && order.status !== "COMPLETED" && (
                 handleStatusChange(order.id, e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus="PENDING">Pending
                  Assigned
                  In Progress
                  Completed
                  {userRole === "MANAGER" && Cancelled}
                
              )}

               setExpandedOrder(expandedOrder === order.id ? null)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover=== order.id ? "Hide Details" : "View Details"}
              
            
          

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            
              
                Address="text-sm text-gray-600">{order.customerAddress}
              
              
              
                Description="text-sm text-gray-600">{order.description}
              

              {order.notes && (
                
                  Notes="text-sm text-gray-600">{order.notes}
                
              )}

              
                
                  Created by="font-medium">Assigned to)}
                
                  Created).toLocaleDateString()}
                
              
            
          )}
        
      ))}
    
  )
}
