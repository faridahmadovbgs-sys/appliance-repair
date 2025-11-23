import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"
import { getCurrentUser } from "@/lib/current-user"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  return 
}
