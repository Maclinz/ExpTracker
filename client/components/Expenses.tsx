import { trendDown } from "@/util/Icons";
import React from "react";
import ExpenseLineCHart from "./ExpenseLineCHart";
import { useExpenseContext } from "@/context/expenseContext";
import formatMoney from "@/util/formatMoney";

function Expenses() {
  const { totalExpenses } = useExpenseContext();

  return (
    <div className="pt-2 pb-4 px-6 w-full bg-[#313234] rounded-[13px]">
      <div>
        <p className="py-1 text-sm font-medium text-gray-300 flex items-center gap-2">
          <span className="w-9 h-9 flex items-center justify-center bg-[#FC4B4B]/15 rounded-md text-[##FC4B4B] text-[17px]">
            {trendDown}
          </span>
          <span className="text-sm font-medium">Expenses</span>
        </p>
        <h3 className="text-4xl font-bold text-white">
          {formatMoney("GBP", totalExpenses)}
        </h3>
      </div>

      <div>
        <ExpenseLineCHart />
      </div>
    </div>
  );
}

export default Expenses;
