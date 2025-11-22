import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "./prisma"
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
        const user = await prisma.user.findUnique({ 
          where: { email },
          include: { organization: true }
        })

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) return null

        // Handle both old and new schema
        const userName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : (user as any).name || user.email

        const orgName = user.organization?.name || "Default Organization"

        return {
          id: user.id,
          email: user.email,
          name: userName,
          role: user.role,
          organizationId: user.organizationId || "default",
          organizationName: orgName,
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
