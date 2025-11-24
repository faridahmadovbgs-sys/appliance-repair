import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "./firestore"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data
        
        try {
          const user = await getUserByEmail(email)

          if (!user) return null

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
          if (!passwordsMatch) return null

          const userName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email

          return {
            id: user.id,
            email: user.email,
            name: userName,
            role: user.role,
            organizationId: user.organizationId,
            organizationName: user.organizationName,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organizationId = (user as any).organizationId
        token.organizationName = (user as any).organizationName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role as string
        ;(session.user as any).id = token.sub
        ;(session.user as any).organizationId = token.organizationId as string
        ;(session.user as any).organizationName = token.organizationName as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
