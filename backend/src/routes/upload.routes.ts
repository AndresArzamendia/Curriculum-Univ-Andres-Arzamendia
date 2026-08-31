import { Router } from "express";
import { upload, uploadFile } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, upload.single("file"), uploadFile);

export default router;
