import type { NextAuthConfig } from 'next-auth';
import prisma from './app/lib/prisma';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify-request'
  },
    callbacks: {
    async jwt({user, trigger, token, session}) {
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
          token.name = user.email
        }
      }
      if (trigger === 'update' && session) {
        console.log(token.sub, session)
        if (typeof(session) === 'string' && token.sub === session) {
          const userFromDB = await prisma.user.findUnique({
            where: {
              id: session
            },
            select: {
              email: true,
              name: true,
              image: true
            }
          })
          if (userFromDB) {
            token.email = userFromDB.email;
            token.name = userFromDB.name;
            token.picture = userFromDB.image;
          }
          console.log('newUser:', userFromDB);
        }
      }
      return token
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = request.nextUrl.pathname.startsWith('/profile');
      const isOnSignIn = request.nextUrl.pathname.startsWith('/signin')
      if (isOnProfile) {
        if (isLoggedIn) {
          return true;
        }
        return NextResponse.redirect(new URL('/', request.nextUrl.origin))
      } else if (isOnSignIn && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin))
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