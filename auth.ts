import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Google],
  pages: {
    signIn: "/", // Redirects to custom sign-in page
    // signOut: "/", // Redirects to custom sign-out page
  },
});
