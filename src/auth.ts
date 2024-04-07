import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/nodemailer";
import { authConfig } from './auth.config';
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from './app/lib/prisma';


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});