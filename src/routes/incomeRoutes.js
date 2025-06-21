import exress from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addIncome,
  deleteIncome,
  getIncomeById,
  getIncomes,
  getTotalIncomes,
} from "../controllers/expense/incomeController.js";

const router = exress.Router();

router.post("/income", protect, addIncome);
router.get("/incomes", protect, getIncomes);

router.get("/income/:id", protect, getIncomeById);
router.delete("/income/:id", protect, deleteIncome);

router.get("/incomes/total", protect, getTotalIncomes);

export default router;
