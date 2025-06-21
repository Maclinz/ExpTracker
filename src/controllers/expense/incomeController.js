import asyncHandler from "express-async-handler";
import IncomeModel from "../../models/expense/IncomeModel.js";

export const addIncome = asyncHandler(async (req, res) => {
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

    // create a new income entry
    const income = new IncomeModel({
      title,
      category,
      amount,
      description,
      date,
      user: userId,
    });

    await income.save();

    return res.status(201).json(income);
  } catch (error) {
    console.log("Error in addincome:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getIncomes = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const incomes = await IncomeModel.find({ user: req.user._id });

    return res.status(200).json(incomes);
  } catch (error) {
    console.log("Error in getincomes:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getIncomeById = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const income = await IncomeModel.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(200).json(income);
  } catch (error) {
    console.log("Error in getIncomeById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const deleteIncome = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    const income = await IncomeModel.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.log("Error in getIncomeById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getTotalIncomes = asyncHandler(async (req, res) => {
  try {
    if (!req.user._id) {
      return res.status(400).json({ message: "Unauthorised please login!" });
    }

    // calculate total incomes
    const totalIncomes = await IncomeModel.aggregate([
      {
        $match: { user: req.user._id }, // macth incomes for the logged-in user
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // sum the amount field
        },
      },
    ]);

    // If no incomes found, total will be 0
    const total = totalIncomes.length > 0 ? totalIncomes[0].total : 0;

    return res.status(200).json({ total });
  } catch (error) {
    console.log("Error in getTotalincome:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
