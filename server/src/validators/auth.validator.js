import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2).max(100),
    lastName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(191).transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(72),
    phone: z.string().trim().max(30).optional(),
    role: z.enum(["TRAVELER", "VENDOR"]).default("TRAVELER"),
    agencyName: z.string().trim().max(191).optional(),
  })
  .superRefine((data, context) => {
    if (data.role === "VENDOR" && !data.agencyName) {
      context.addIssue({
        code: "custom",
        path: ["agencyName"],
        message: "Business name is required for vendor registration",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

