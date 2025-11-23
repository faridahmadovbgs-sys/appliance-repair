"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

type WorkOrder = {
  id) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, loading, router])

  useEffect(() => {
    filterOrders()
  }, [searchTerm, statusFilter, priorityFilter, orders])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/work-orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders, error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.title?.toLowerCase().includes(term) ||
          order.customerName?.toLowerCase().includes(term) ||
          order.customerPhone?.includes(term) ||
          order.customerAddress?.toLowerCase().includes(term) ||
          order.description?.toLowerCase().includes(term) ||
          order.id?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((order) => order.priority === priorityFilter)
    }

    setFilteredOrders(filtered)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year,
      month,
      day,
      hour,
      minute,
    })
  }

  const formatServiceType = (type) => {
    if (!type) return "N/A"
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
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

  if (loading || ordersLoading) {
    return (
      
        
          
          Loading...
        
      
    )
  }

  return (
    
      {/* Header */}
      
        
            
              
                  
                
              
              Work Orders History
            
            
              
                {user?.name}
              
              
                {user?.role}
              
            
          
        
      

      
          
                Search
              
              
                
                  
                    
                  
                
                 setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus="Search by customer name, phone, address, or order details..."
                />
              
            

            {/* Status Filter */}
            
              
                Status
              
               setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus="ALL">All Statuses
                Pending
                Assigned
                In Progress
                Completed
                Cancelled
              
            

            {/* Priority Filter */}
            
              
                Priority
              
               setPriorityFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus="ALL">All Priorities
                Low
                Medium
                High
                Urgent
              
            

            {/* Results Count */}
            
              
                Showing {filteredOrders.length} of{" "}
                {orders.length} orders
              
            
          

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL") && (
            
               {
                  setSearchTerm("")
                  setStatusFilter("ALL")
                  setPriorityFilter("ALL")
                }}
                className="text-sm text-blue-600 hover)}
        

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          
            
              
            
            No orders found
            
              {searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "No work orders available"}
            
          
        )
          
            
              
                
                  
                    
                      Order Details
                    
                    
                      Customer
                    
                    
                      Service Type
                    
                    
                      Status
                    
                    
                      Priority
                    
                    
                      Assigned To
                    
                    
                      Created
                    
                  
                
                
                  {filteredOrders.map((order) => (
                    
                        {order.title}
                        {order.description?.substring(0, 50)}...
                      
                      
                        {order.customerName}
                        {order.customerPhone}
                        {order.customerAddress?.substring(0, 30)}...
                      
                      
                        {formatServiceType(order.serviceType)}
                      
                      
                        
                          {order.status.replace(/_/g, " ")}
                        
                      
                      
                        
                          {order.priority}
                        
                      
                      
                        {order.assignedUserName || "Unassigned"}
                      
                      
                        {formatDate(order.createdAt)}
                        by {order.createdByName}
                      
                    
                  ))}
                
              
            
          
        )}
      
    
  )
}
