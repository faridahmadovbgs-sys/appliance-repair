import { SignJWT, jwtVerify } from "jose"

export type AuthUserClaims = {
  id= "auth_token"
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
export const isProd = process.env.NODE_ENV === "production"

const encoder = new TextEncoder()
let cachedSecret= null

function getSecretKey() {
  if (cachedSecret) {
    return cachedSecret
  }

  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === "development" ? "dev-only-insecure-secret" : "demo-insecure-secret")

  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET && !process.env.JWT_SECRET) {
    console.warn("[auth-token] WARNING)
  }

  cachedSecret = encoder.encode(secret)
  return cachedSecret
}

export async function createAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg, typ)
    .setIssuedAt()
    .setExpirationTime(`${AUTH_COOKIE_MAX_AGE}s`)
    .sign(getSecretKey())
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload } catch (error) {
    console.error("Invalid auth token", error)
    return null
  }
}

export function getAuthCookieOptions() {
  return {
    name,
    httpOnly,
    sameSite,
    secure,
    maxAge,
    path,
  }
}
