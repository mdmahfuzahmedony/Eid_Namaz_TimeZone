import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // ১. সেশন স্ট্র্যাটেজি সেট করা
  session: {
    strategy: "jwt",
  },
  
  // ২. সিক্রেট কি (অবশ্যই .env ফাইলে NEXTAUTH_SECRET থাকতে হবে)
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) {
          throw new Error("ফোন নম্বর এবং পাসওয়ার্ড প্রয়োজন");
        }

        // ডাটাবেসে ইউজার খোঁজা
        const user = await prisma.user.findUnique({
          where: { phoneNumber: credentials.phoneNumber },
        });

        if (!user) {
          throw new Error("এই নম্বর দিয়ে কোনো একাউন্ট পাওয়া যায়নি");
        }

        // পাসওয়ার্ড চেক করা
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("ভুল পাসওয়ার্ড!");
        }

        // ইউজারের তথ্য ফেরত দেওয়া
        return {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          image: user.image, 
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // প্রথমবার লগইন করার সময় টোকেনে ডাটা সেট করা
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image; // NextAuth ডিফল্টভাবে picture কি ব্যবহার করে
      }

      // ✅ ড্যাশবোর্ড থেকে update() কল করলে এটি সেশন আপডেট করবে
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.picture = session.user.image;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.picture; 
      }
      return session;
    },
  },

  // আপনার কাস্টম লগইন পেজ থাকলে এখানে সেটি দিন
  pages: {
    signIn: "/login", 
  },
});

export { handler as GET, handler as POST };