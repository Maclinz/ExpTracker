"use client";
import { sack } from "@/util/Icons";
import React from "react";
import IncomeBarChart from "./IncomeBarChart";
import { useExpenseContext } from "@/context/expenseContext";
import formatMoney from "@/util/formatMoney";

function Incomes() {
  const { totalIncomes } = useExpenseContext();

  return (
    <div className="pt-2 pb-4 px-6 w-full bg-[#313234] rounded-[13px]">
      <div>
        <p className="py-1 text-sm font-medium text-gray-300 flex items-center gap-2">
          <span className="w-9 h-9 flex items-center justify-center bg-[#88dde2]/15 rounded-md text-[#88dde2] text-[17px]">
            {sack}
          </span>
          <span className="text-sm font-medium">Total Income</span>
        </p>
        <h3 className="text-4xl font-bold text-white">
          {formatMoney("GBP", totalIncomes)}
        </h3>
      </div>

      <div>
        <IncomeBarChart />
      </div>
    </div>
  );
}

export default Incomes;
