import { z } from "zod";

export const vendorIdSchema = z.coerce.number().int().positive();

export const vendorListQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const vendorStatusSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    rejectionNote: z.string().trim().max(1000).optional(),
  })
  .superRefine((input, context) => {
    if (input.status === "REJECTED" && !input.rejectionNote) {
      context.addIssue({
        code: "custom",
        path: ["rejectionNote"],
        message: "Add a reason when rejecting a vendor",
      });
    }
  });
