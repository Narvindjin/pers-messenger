import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/nodemailer";
import { authConfig } from './auth.config';
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/app/lib/prisma";


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
});