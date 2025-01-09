import NextAuth, { DefaultSession, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import User from '@/models/user.model';
import dbConnect from '@/dbConfig/dbConfig';
import { sendEmail } from '@/utils/mailer';

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}
  
  interface Session extends DefaultSession {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {}
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
      async authorize(credentials, request) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password');
          }

          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

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
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session?.user) {
        (session.user as any).accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: `${process.env.NEXTAUTH_URL}/auth/signin`,
    error: `${process.env.NEXTAUTH_URL}/auth/error`,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// This is the proper way to export auth routes for Next.js App Router
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;