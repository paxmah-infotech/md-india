import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Add your authentication providers here
  providers: [],
};

/**
 * Helper to get the JWT token from the session
 */
export const getToken = async (req: Request): Promise<JWT | null> => {
  try {
    const token = await fetch('/api/auth/session').then(res => res.json());
    return token;
  } catch (error) {
    return null;
  }
};
