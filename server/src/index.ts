import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import casesRouter from './routes/cases';
import aiRouter from './routes/ai';
import documentsRouter from './routes/documents';
import channelsRouter from './routes/channels';
import insightsRouter from './routes/insights';
import auditRouter from './routes/audit';

app.use('/api/cases', casesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/audit', auditRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/auth/login", (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: "Role is required" });
  
  // Fake login for Phase 1
  res.json({ token: `fake-jwt-for-${role}`, user: { id: 1, role } });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
