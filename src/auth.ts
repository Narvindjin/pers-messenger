import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/nodemailer";
import { authConfig } from './auth.config';


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
});