import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

type AdminUser = {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  passwordHash?: string;
  allowedProviders?: string[];
};

async function findAdminByEmail(email?: string | null) {
  if (!email) return null;

  const { db } = await connectToDatabase();

  const admin = await db.collection<AdminUser>("admin_users").findOne({
    email: email.toLowerCase().trim(),
  });

  return admin;
}

function isProviderAllowed(admin: AdminUser, provider: string) {
  return admin.allowedProviders?.includes(provider) ?? false;
}

const providers = [
  Credentials({
    name: "Admin Login",

    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "admin@example.com",
      },
      password: {
        label: "Password",
        type: "password",
      },
    },

    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;

      if (!email || !password) {
        return null;
      }

      const admin = await findAdminByEmail(email);

      if (!admin) {
        return null;
      }

      if (admin.status !== "active") {
        return null;
      }

      if (!isProviderAllowed(admin, "credentials")) {
        return null;
      }

      if (!admin.passwordHash) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        admin.passwordHash
      );

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      } as any;
    },
  }),

  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  providers,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const admin = await findAdminByEmail(user.email);

        if (!admin) {
          return false;
        }

        if (admin.status !== "active") {
          return false;
        }

        if (!isProviderAllowed(admin, "google")) {
          return false;
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const admin = await findAdminByEmail(user.email);

        if (admin && admin.status === "active") {
          token.id = admin._id.toString();
          token.name = admin.name;
          token.email = admin.email;
          token.role = admin.role;
          token.status = admin.status;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }

      return session;
    },
  },
});