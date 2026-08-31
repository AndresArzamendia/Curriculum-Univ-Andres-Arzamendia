import { Router } from "express";
import { trackEvent, getMetrics } from "../controllers/metric.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/track", trackEvent);
router.get("/", authenticate, getMetrics);

export default router;
