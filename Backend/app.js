import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./src/config/db.js";
import memberRoutes from "./src/routes/member.routes.js";
import depositRoutes from "./src/routes/deposit.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import summaryRoutes from "./src/routes/summary.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import cors from "cors";

const app = express();

app.use(cors())

// Middleware
app.use(express.json());

// Database Connection
connectDB();
app.use("/api/members", memberRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});