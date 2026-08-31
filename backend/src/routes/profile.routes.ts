import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getProfile);
router.put("/", authenticate, updateProfile);

export default router;
