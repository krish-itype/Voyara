import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AUTH_COOKIE_NAME } from "../utils/token.js";

export const authenticate = asyncHandler(async (request, _response, next) => {
  const bearerToken = request.headers.authorization?.startsWith("Bearer ")
    ? request.headers.authorization.slice(7)
    : null;
  const token = request.cookies[AUTH_COOKIE_NAME] || bearerToken;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Your session is invalid or has expired", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: {
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
    },
  });

  if (!user) {
    throw new AppError("Account not found", 401);
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("This account has been suspended", 403);
  }

  request.user = user;
  next();
});

export const authorize = (...roles) => (request, _response, next) => {
  if (!request.user || !roles.includes(request.user.role)) {
    return next(new AppError("You do not have permission to access this resource", 403));
  }

  next();
};

