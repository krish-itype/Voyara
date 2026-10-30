import { Router } from "express";
import {
  getDashboard,
  listVendors,
  updateVendorStatus,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));
router.get("/dashboard", asyncHandler(getDashboard));
router.get("/vendors", asyncHandler(listVendors));
router.patch("/vendors/:vendorId/status", asyncHandler(updateVendorStatus));

export default router;
