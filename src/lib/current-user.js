import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, verifyAuthToken, AuthUserClaims } from "./auth-token"

export async function getCurrentUser()> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return null
  }

  return verifyAuthToken(token)
}
