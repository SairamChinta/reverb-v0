import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//           clientId: process.env.GOOGLE_CLIENT_ID!,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//         })
//       ],
//       secret:process.env.NEXTAUTH_SECRET ?? "secret",
//       callbacks: {
//         async signIn(params){
//           if(!params.user.email){
//             return false;
//           }
//           try {
//             await prismaClient.user.create({
//               data:{
//                 email: params.user.email,
//                 provider: "Google"
//               }
//             })
//           } catch (e) {
            
//           }
//           return true;
//         }
//       }
// })

// export {handler as GET, handler as POST}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {//@ts-expect-error: This params type is incorrect
    async signIn(params) {
      if (!params.user.email) return false;
      try {
        await prismaClient.user.create({
          data: { email: params.user.email, provider: "Google" },
        });
      } catch  {
        // ignore duplicate error
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
