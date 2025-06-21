import asyncHandler from "express-async-handler";
import ExpenseModel from "../../models/expense/ExpenseModel.js";
import IncomeModel from "../../models/expense/IncomeModel.js";

export const addExpense = asyncHandler(async (req, res) => {
  try {
    const { title, category, amount, description, date } = req.body;
    const userId = req.user._id;

    if (!title || !category || !amount) {
      return res
        .status(400)
        .json({ message: "Title, category, and amount are required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized please login!" });
    }

    const expense = new ExpenseModel({
      title,
      category,
      amount,
      description,
      date,
      user: userId,
    });

    await expense.save();

    return res.status(201).json(expense);
  } catch (error) {
    console.log("Error in addExpense:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getExpenses = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const expenses = await ExpenseModel.find({ user: req.user._id });

    // get all incomes
    const incomes = await IncomeModel.find({ user: req.user._id });

    const incomesModified = incomes.map((income) => ({
      ...income.toObject(),
      type: "income",
    }));

    const expensesModified = expenses.map((expense) => ({
      ...expense.toObject(),
      type: "expense",
    }));

    // combine incomes and expenses --> sort by date --> recent first
    const allTransactions = [...incomesModified, ...expensesModified].sort(
      (a, b) => {
        return b.createdAt - a.createdAt;
      }
    );

    return res.status(200).json(allTransactions);
  } catch (error) {
    console.log("Error in getExpenses:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getExpenseById = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.log("Error in getExpenseById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const deleteExpense = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const expense = await ExpenseModel.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log("Error in getExpenseById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getTotalExpenses = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    // calculate total expenses
    const totalExpenses = await ExpenseModel.aggregate([
      {
        $match: { user: req.user._id }, // macth expenses for the logged-in user
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // sum the amount field
        },
      },
    ]);

    // If no expenses found, total will be 0
    const total = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

    return res.status(200).json({ total });
  } catch (error) {
    console.log("Error in getTotalExpense:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// history
export const getExpenseHistory = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    // get all expenses for the user
    const expenses = await ExpenseModel.find({ user: req.user._id });

    // get all incomes for the user
    const incomes = await IncomeModel.find({ user: req.user._id });

    const incomesModified = incomes.map((income) => ({
      ...income.toObject(),
      type: "income",
    }));

    const expensesModified = expenses.map((expense) => ({
      ...expense.toObject(),
      type: "expense",
    }));

    // combine incomes and expenses
    const allTransactions = [...incomesModified, ...expensesModified];

    // sort by date --> recent first
    allTransactions.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // limit to 5 --> splice mutates the original array
    allTransactions.splice(5);

    return res.status(200).json(allTransactions);
  } catch (error) {
    console.log("Error in getExpenseHistory:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
