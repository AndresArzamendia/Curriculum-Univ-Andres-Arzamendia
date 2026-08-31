import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import certificateRoutes from "./routes/certificate.routes";
import skillRoutes from "./routes/skill.routes";
import metricRoutes from "./routes/metric.routes";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/metrics", metricRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;
