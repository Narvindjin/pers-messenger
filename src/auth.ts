import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/nodemailer";
import { authConfig } from './auth.config';
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from './app/lib/prisma';
import {Provider} from "@auth/core/providers";
import github from 'next-auth/providers/github';


const providers: Provider[] = [
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
    github
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})



export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: providers
});