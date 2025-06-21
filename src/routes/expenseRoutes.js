import exress from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addExpense,
  deleteExpense,
  getExpenseById,
  getExpenseHistory,
  getExpenses,
  getTotalExpenses,
} from "../controllers/expense/expenseController.js";

const router = exress.Router();

router.post("/expense", protect, addExpense);
router.get("/expenses", protect, getExpenses);

router.get("/expense/:id", protect, getExpenseById);
router.delete("/expense/:id", protect, deleteExpense);

router.get("/expenses/total", protect, getTotalExpenses);
router.get("/expenses/history", protect, getExpenseHistory);

export default router;
