import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin/',
  },
    callbacks: {
    /*authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      if (isOnProfile) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/profile', nextUrl));
      }
      return true;
    },*/
  },
  providers: [],
} satisfies NextAuthConfig;