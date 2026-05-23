import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

type AdminUser = {
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  passwordHash: string;
  allowedProviders: string[];
  createdAt: Date;
  updatedAt: Date;
};

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email) {
    throw new Error("SEED_ADMIN_EMAIL is missing in .env.local");
  }

  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD is missing in .env.local");
  }

  const { connectToDatabase } = await import("../src/lib/mongodb");

  const { db } = await connectToDatabase();

  const existingAdmin = await db.collection("admin_users").findOne({ email });

  const passwordHash = await bcrypt.hash(password, 10);

  const adminData: AdminUser = {
    name,
    email,
    role: "super_admin",
    status: "active",
    passwordHash,
    allowedProviders: ["credentials", "google"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (existingAdmin) {
    await db.collection("admin_users").updateOne(
      { email },
      {
        $set: {
          name: adminData.name,
          role: adminData.role,
          status: adminData.status,
          passwordHash: adminData.passwordHash,
          allowedProviders: adminData.allowedProviders,
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Updated existing admin: ${email}`);
    return;
  }

  await db.collection("admin_users").insertOne(adminData);

  console.log(`Created new admin: ${email}`);
}

main()
  .then(() => {
    console.log("Admin seed completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  });