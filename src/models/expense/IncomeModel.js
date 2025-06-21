import mongoose, { Schema } from "mongoose";

const IncomeSchema = new mongoose.Schema(
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
      default: "Other",
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

const IncomeModel = mongoose.model("Income", IncomeSchema);

export default IncomeModel;
