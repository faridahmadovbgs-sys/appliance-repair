"use client"

import { useEffect, useState } from "react"

type Worker = {
  id= {
  order) => void
  onAssign) => void
}

export default function AssignOrderModal({ order, onClose, onAssign }) {
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("/api/users/workers")
        if (res.ok) {
          const data = await res.json()
          setWorkers(data)
        }
      } catch (error) {
        console.error("Failed to fetch workers, error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedWorker) {
      onAssign(selectedWorker)
    }
  }

  return (
    
      
        
          Assign Worker to Order {order.orderNumber}
        

        
          
            Customer="text-sm text-gray-600">
            Service, " ")}
          
        

        {loading ? (
          Loading workers...
        )
          
            
              
                Select Field Worker
              
               setSelectedWorker(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="">-- Select a worker --
                {workers.map((worker) => (
                  
                    {worker.firstName} {worker.lastName} ({worker.email})
                  
                ))}
              
            

            
              
    
  )
}
