import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "../utils/token.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatarUrl: true,
  role: true,
  status: true,
  emailVerified: true,
  vendorProfile: true,
};

export async function register(request, response) {
  const input = registerSchema.parse(request.body);
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new AppError("An account with that email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        phone: input.phone || null,
        role: input.role,
      },
    });

    if (input.role === "VENDOR") {
      await transaction.vendorProfile.create({
        data: {
          userId: createdUser.id,
          agencyName: input.agencyName,
        },
      });
    }

    return transaction.user.findUnique({
      where: { id: createdUser.id },
      select: publicUserSelect,
    });
  });

  const token = signAuthToken(user);
  setAuthCookie(response, token);

  response.status(201).json({
    success: true,
    message:
      user.role === "VENDOR"
        ? "Vendor account created and awaiting approval"
        : "Traveler account created",
    data: { user },
  });
}

export async function login(request, response) {
  const input = loginSchema.parse(request.body);
  const userWithPassword = await prisma.user.findUnique({
    where: { email: input.email },
  });

  const passwordMatches = userWithPassword
    ? await bcrypt.compare(input.password, userWithPassword.passwordHash)
    : false;

  if (!userWithPassword || !passwordMatches) {
    throw new AppError("Incorrect email or password", 401);
  }

  if (userWithPassword.status === "SUSPENDED") {
    throw new AppError("This account has been suspended", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: userWithPassword.id },
    select: publicUserSelect,
  });
  const token = signAuthToken(user);
  setAuthCookie(response, token);

  response.json({
    success: true,
    message: "Signed in successfully",
    data: { user },
  });
}

export function logout(_request, response) {
  clearAuthCookie(response);
  response.json({ success: true, message: "Signed out successfully" });
}

export function getCurrentUser(request, response) {
  response.json({ success: true, data: { user: request.user } });
}

