import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'

const isDev = process.env.NODE_ENV === 'development'
const hasAzure = !!(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID)
// Allow credentials login in dev OR when explicitly enabled (e.g. demo / staging)
const allowCredentials = isDev || process.env.ALLOW_DEMO_LOGIN === 'true'

const providers = []

// Azure AD — only when credentials are configured
if (hasAzure) {
  providers.push(
    MicrosoftEntraID({
      clientId:     process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer:       `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    })
  )
}

// Credentials login — available in dev or when ALLOW_DEMO_LOGIN=true
if (allowCredentials) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        name:  { label: 'Name',  type: 'text',  placeholder: 'Malcolm Govender' },
        email: { label: 'Email', type: 'email', placeholder: 'you@company.com'  },
        opco:  { label: 'OpCo', type: 'text',  placeholder: 'South Africa'     },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        // Upsert a user in the DB
        const user = await db.user.upsert({
          where:  { email: credentials.email as string },
          update: { name: credentials.name as string, opco: credentials.opco as string },
          create: {
            email: credentials.email as string,
            name:  credentials.name  as string || 'Dev User',
            opco:  credentials.opco  as string || 'South Africa',
            role:  'SUPER_ADMIN',
          },
        })
        return user
      },
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter:   PrismaAdapter(db),
  providers,
  session:   { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
        token.opco = (user as any).opco
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id   = token.id   as string
        session.user.role = token.role as string
        session.user.opco = token.opco as string | null
      }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})

declare module 'next-auth' {
  interface Session {
    user: {
      id:    string
      name:  string | null
      email: string
      image: string | null
      role:  string
      opco:  string | null
    }
  }
}
