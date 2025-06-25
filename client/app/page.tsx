"use client";
import Balance from "@/components/Balance";
import Expenses from "@/components/Expenses";
import IncomeExpense from "@/components/IncomeExpense";
import Incomes from "@/components/Incomes";
import Sidebar from "@/components/Sidebar";
import { useExpenseContext } from "@/context/expenseContext";
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { Expense } from "@/types/type";
import formatMoney from "@/util/formatMoney";

export default function Home() {
  useRedirect("/login");

  const { name } = useUserContext()?.user;
  const { expenses, incomes } = useExpenseContext();

  const filteredExpenses = expenses.filter((expense: Expense) => {
    return expense.type === "expense";
  });

  const minExpense = Math.min(
    ...filteredExpenses.map((expense: Expense) => expense.amount)
  );

  const maxExpense = Math.max(
    ...filteredExpenses.map((expense: Expense) => expense.amount)
  );

  const minIncome = Math.min(
    ...incomes.map((income: Expense) => income.amount)
  );

  const maxIncome = Math.max(
    ...incomes.map((income: Expense) => income.amount)
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white">My Dashboard</h1>
          <p className="mt-2 text-sm">Good to see you, {name}!</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Create Income */}
          {/* Create Expense */}
        </div>
      </div>
      <div className="mt-8 flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-6">
            {/* Incomes */}
            <Incomes />
            {/* Expenses */}
            <Expenses />
            {/* Balance */}
            <Balance />
          </div>
          <div className="mt-6">
            <IncomeExpense />
          </div>

          <div className="mt-6 flex gap-6">
            <div className="flex-1 flex gap-6">
              <p className="w-full py-6 px-2 flex items-center justify-center gap-2 bg-[#313234] rounded-[13px]">
                <span className="text-gray-200">Min Income:</span>
                <span className="font-bold text-[#88DDE2]/90">
                  {formatMoney("GBP", minIncome)}
                </span>
              </p>
              <p className="w-full py-6 px-2 flex items-center justify-center gap-2 bg-[#313234] rounded-[13px]">
                <span className="text-gray-200">Max Income:</span>
                <span className="font-bold text-[#88DDE2]">
                  {formatMoney("GBP", maxIncome)}
                </span>
              </p>
            </div>
            <div className="flex-1 flex gap-6">
              <p className="w-full py-6 px-2 flex items-center justify-center gap-2 bg-[#313234] rounded-[13px]">
                <span className="text-gray-200">Min Expense:</span>
                <span className="font-bold text-red-400/90">
                  {formatMoney("GBP", minExpense)}
                </span>
              </p>{" "}
              <p className="w-full py-6 px-2 flex items-center justify-center gap-2 bg-[#313234] rounded-[13px]">
                <span className="text-gray-200">Max Expense:</span>
                <span className="font-bold text-red-400">
                  {formatMoney("GBP", maxExpense)}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-[30%]">{/* Transaction History */}</div>
      </div>
    </>
  );
}
