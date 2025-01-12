//lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { magicLink } from "better-auth/plugins";
import { cache } from "react";
import { headers } from "next/headers";


const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string"
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

  },

  plugins: [
    magicLink({
      async sendMagicLink({ email, url }) {
        if (!url) {
          throw new Error("Magic link URL is required");
        }

        try {
          await resend.emails.send({
            from: "New Store <noreply@resend.dev>",
            to: email,
            subject: "Sign in to New Store",
            html: `
                <div>
                  <h1>Welcome to New Store</h1>
                  <p>Click the link below to sign in to your account.</p>
                  <p><a href="${url}">Sign in to New Store</a></p>
                  <p>If you didn't request this email, you can safely ignore it.</p>
                </div>
              `,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error instanceof Error ? error.message : String(error));
          throw error instanceof Error
            ? error
            : new Error("Failed to send verification email");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers()
  })
})