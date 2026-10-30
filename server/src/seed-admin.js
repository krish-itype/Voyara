import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./config/prisma.js";

const required = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_FIRST_NAME", "ADMIN_LAST_NAME"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Set them for this terminal, then run npm run db:seed-admin again.");
  process.exitCode = 1;
} else if (process.env.ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD must contain at least 8 characters.");
  process.exitCode = 1;
} else {
  try {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: process.env.ADMIN_FIRST_NAME.trim(),
        lastName: process.env.ADMIN_LAST_NAME.trim(),
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      create: {
        firstName: process.env.ADMIN_FIRST_NAME.trim(),
        lastName: process.env.ADMIN_LAST_NAME.trim(),
        email,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      select: { id: true, email: true, role: true },
    });
    console.log(`Admin account ready: ${admin.email} (${admin.role})`);
  } catch (error) {
    console.error("Could not create the admin account:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
