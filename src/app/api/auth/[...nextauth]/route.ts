import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import User from '@/models/user.model';
import dbConnect from '@/dbConfig/dbConfig';
import { sendEmail } from '@/utils/mailer';

// Define custom user type
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

declare module "next-auth" {
  interface User extends CustomUser { }

  interface Session extends DefaultSession {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser { }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        browser: { label: 'Browser', type: 'text', optional: true },
        os: { label: 'OS', type: 'text', optional: true },
        location: { label: 'Location', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          if (!user.isVerified) {
            await sendEmail({
              email: user.email,
              emailType: "VERIFY",
              userId: user._id,
            });
            throw new Error('Please verify your email. Verification email sent.');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'user'
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = user.role;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name as string;
          session.user.role = token.role;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
