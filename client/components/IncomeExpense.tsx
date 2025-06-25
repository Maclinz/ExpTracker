import { money } from "@/util/Icons";
import React from "react";
import IncomeExpenseLine from "./IncomeExpenseLine";

function IncomeExpense() {
  return (
    <div className="pt-2 pb-4 px-6 w-full bg-[#313234] rounded-[13px]">
      <div>
        <p className="py-1 text-sm font-medium text-gray-300 flex items-center gap-2">
          <span className="w-9 h-9 flex items-center justify-center bg-green-500/15 rounded-md text-green-500 text-[17px]">
            {money}
          </span>
          <span className="text-sm to-gray-400 font-medium">Expenses</span>
        </p>
      </div>
      <IncomeExpenseLine />
    </div>
  );
}

export default IncomeExpense;
