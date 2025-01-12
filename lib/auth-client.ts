//lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const baseURL = process.env.NEXT_PUBLIC_APP_URL!;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_APP_URL is required");
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    magicLinkClient(),

  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
