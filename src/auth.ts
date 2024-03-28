import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/nodemailer";
import { authConfig } from './auth.config';


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
});