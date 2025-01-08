import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/user.model'
import dbConnect from '@/dbConfig/dbConfig'
import bcrypt from 'bcrypt'
import { sendEmail } from '@/utils/mailer'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password.')
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No account found with that email.')
        }

        if (!user.isVerified) {
          await sendEmail({
            email: user.email,
            emailType: 'VERIFY',
            userId: user._id.toString()
          })
          throw new Error('Please verify your email. Verification email sent.')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) {
          throw new Error('Invalid password.')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || '',
          image: user.image || '',
          role: user.role || 'user'
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name || ''
        token.image = user.image || ''
        token.role = user.role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name || '',
          image: token.image || '',
          role: token.role || 'user'
        }
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
}
