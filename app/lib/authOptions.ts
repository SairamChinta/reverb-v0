import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/app/lib/db";

export const reverbAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn({ user }: any) {
      if (!user.email) return false;
      try {
        await prismaClient.user.create({
          data: { email: user.email, provider: "Google" },
        });
      } catch {
        // ignore duplicates
      }
      return true;
    },
  },
};
