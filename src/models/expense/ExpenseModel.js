import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    category: {
      type: String,
      required: true,
      default: "Miscellaneous",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("Expense", ExpenseSchema);

export default ExpenseModel;
