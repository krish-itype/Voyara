import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  vendorIdSchema,
  vendorListQuerySchema,
  vendorStatusSchema,
} from "../validators/admin.validator.js";

const vendorInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
    },
  },
};

export async function getDashboard(request, response) {
  const [pendingVendors, pendingListings, openEnquiries, totalUsers, recentVendors] =
    await Promise.all([
      prisma.vendorProfile.count({ where: { status: "PENDING" } }),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.enquiry.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
      prisma.user.count(),
      prisma.vendorProfile.findMany({
        where: { status: "PENDING" },
        include: vendorInclude,
        orderBy: { createdAt: "asc" },
        take: 8,
      }),
    ]);

  response.json({
    success: true,
    data: {
      stats: { pendingVendors, pendingListings, openEnquiries, totalUsers },
      recentVendors,
    },
  });
}

export async function listVendors(request, response) {
  const input = vendorListQuerySchema.parse(request.query);
  const where = input.status ? { status: input.status } : {};
  const skip = (input.page - 1) * input.limit;
  const [vendors, total] = await Promise.all([
    prisma.vendorProfile.findMany({
      where,
      include: vendorInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: input.limit,
    }),
    prisma.vendorProfile.count({ where }),
  ]);

  response.json({
    success: true,
    data: {
      vendors,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        pages: Math.ceil(total / input.limit),
      },
    },
  });
}

export async function updateVendorStatus(request, response) {
  const vendorId = vendorIdSchema.parse(request.params.vendorId);
  const input = vendorStatusSchema.parse(request.body);
  const existingVendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: vendorInclude,
  });

  if (!existingVendor) {
    throw new AppError("Vendor profile not found", 404);
  }

  const vendor = await prisma.$transaction(async (transaction) => {
    const updatedVendor = await transaction.vendorProfile.update({
      where: { id: vendorId },
      data: {
        status: input.status,
        verifiedAt: input.status === "APPROVED" ? new Date() : null,
        rejectionNote: input.status === "REJECTED" ? input.rejectionNote : null,
      },
      include: vendorInclude,
    });

    await transaction.adminAudit.create({
      data: {
        actorId: request.user.id,
        action: input.status === "APPROVED" ? "VENDOR_APPROVED" : "VENDOR_REJECTED",
        entityType: "VendorProfile",
        entityId: vendorId,
        details: {
          vendorEmail: existingVendor.user.email,
          previousStatus: existingVendor.status,
          nextStatus: input.status,
          ...(input.rejectionNote ? { rejectionNote: input.rejectionNote } : {}),
        },
      },
    });

    return updatedVendor;
  });

  response.json({
    success: true,
    message: input.status === "APPROVED" ? "Vendor approved" : "Vendor rejected",
    data: { vendor },
  });
}
