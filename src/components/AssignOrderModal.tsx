"use client"

import { useEffect, useState } from "react"

type Worker = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type AssignOrderModalProps = {
  order: any
  onClose: () => void
  onAssign: (workerId: string) => void
}

export default function AssignOrderModal({ order, onClose, onAssign }: AssignOrderModalProps) {
  const [workers, setWorkers] = useState<Worker[]>([])
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
        console.error("Failed to fetch workers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedWorker) {
      onAssign(selectedWorker)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Assign Worker to Order {order.orderNumber}
        </h3>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Customer:</span> {order.customerName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Service:</span> {order.serviceType.replace(/_/g, " ")}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading workers...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Field Worker
              </label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">-- Select a worker --</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.firstName} {worker.lastName} ({worker.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Worker
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
