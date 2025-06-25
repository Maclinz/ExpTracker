"use client";
import { useExpenseContext } from "@/context/expenseContext";
import formatMoney from "@/util/formatMoney";
import { wallet } from "@/util/Icons";
import React from "react";
import BalanceBarChart from "./BalanceBarChart ";

function Balance() {
  const { balance } = useExpenseContext();
  return (
    <div className="pt-2 pb-4 px-6 w-full bg-[#313234] rounded-[13px]">
      <div>
        <p className="py-1 text-sm font-medium text-gray-300 flex items-center gap-2">
          <span className="w-9 h-9 flex items-center justify-center rounded-md bg-[#D5C6F5]/15 text-[#D5C6F5] text-[17px]">
            {wallet}
          </span>
          <span className="text-sm to-gray-400 font-medium">Bal/Exp</span>
        </p>
        <h3 className="text-4xl font-bold text-white">
          {formatMoney("GBP", balance)}
        </h3>
        <div>
          <BalanceBarChart />
        </div>
      </div>
    </div>
  );
}

export default Balance;
