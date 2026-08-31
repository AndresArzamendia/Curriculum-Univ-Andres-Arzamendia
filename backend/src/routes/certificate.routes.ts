import { Router } from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getCertificates);
router.post("/", authenticate, createCertificate);
router.put("/:id", authenticate, updateCertificate);
router.delete("/:id", authenticate, deleteCertificate);

export default router;
