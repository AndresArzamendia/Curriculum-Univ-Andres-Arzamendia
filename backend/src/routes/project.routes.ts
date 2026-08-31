import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
