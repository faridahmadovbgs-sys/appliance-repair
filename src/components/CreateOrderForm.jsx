"use client"

import { useState } from "react"

type CreateOrderFormProps = {
  onSubmit) => void
  onCancel) => void
}

export default function CreateOrderForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customerName,
    customerPhone,
    customerAddress,
    serviceType,
    description,
    priority,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    
      New Work Order
      
      
            Customer Name *
          
           setFormData({ ...formData, customerName)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          
           setFormData({ ...formData, customerPhone)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="block text-sm font-medium text-gray-700 mb-1">
          Address *
        
         setFormData({ ...formData, customerAddress)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="grid grid-cols-1 md="block text-sm font-medium text-gray-700 mb-1">
            Service Type *
          
           setFormData({ ...formData, serviceType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="HANDYMAN">Handyman
            Plumbing
            Appliance Repair
          
        

        
          
            Priority *
          
           setFormData({ ...formData, priority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="LOW">Low
            Medium
            High
            Urgent
          
        
      

      
        
          Description *
        
         setFormData({ ...formData, description)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus="Describe the work needed..."
        />
      

      
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover)
}
