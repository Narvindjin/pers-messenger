import type { NextAuthConfig } from 'next-auth';
import prisma from './app/lib/prisma';

export const authConfig = {
  pages: {
    signIn: '/signin'
  },
    callbacks: {
    async jwt({user, trigger, token}) {
      if (trigger === "signIn" || trigger === 'signUp') {
        if (!user.name) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: user.email,
            },
          })
        }
      }
      return token
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      if (isOnProfile) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
        async session({ session, token }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
          if (!session.user.name) {
            session.user.name = session.user.email;
          }
        }
        return session;
      },
  },
  providers: [],
} satisfies NextAuthConfig;