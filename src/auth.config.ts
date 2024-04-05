import type { NextAuthConfig } from 'next-auth';
import {base} from "next/dist/build/webpack/config/blocks/base";

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
    callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      if (isOnProfile) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/profile', nextUrl));
      }
      return true;
    },
      async redirect({ url, baseUrl }) {
        return baseUrl
      }
  },
  providers: [],
} satisfies NextAuthConfig;