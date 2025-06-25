"use client";
import React from "react";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExpenseContext } from "@/context/expenseContext";
import formatMoney from "@/util/formatMoney";

const chartConfig: ChartConfig = {
  incomes: {
    label: "Incomes",
  },
  expenses: {
    label: "Expenses",
  },
} satisfies ChartConfig;

function IncomeExpenseLine() {
  const { totalExpenses, totalIncomes, expenses } = useExpenseContext();

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("incomes");

  //{ date: "2024-04-01", incomes: 222, expenses: 150 },

  const last14Days = React.useMemo(() => {
    const today = new Date();

    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (13 - i)); // Adjust to get the last 14 days

      return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    });
  }, []);

  const chartData = React.useMemo(() => {
    const groupedData: Record<
      string,
      { date: string; incomes: number; expenses: number }
    > = {};

    for (const { date, amount, type } of expenses) {
      const day = date.slice(0, 10); // Extract the date part (YYYY-MM-DD)

      if (!groupedData[day]) {
        groupedData[day] = {
          date: day,
          incomes: 0,
          expenses: 0,
        };

        if (type === "income") {
          groupedData[day].incomes += amount;
        } else if (type === "expense") {
          groupedData[day].expenses += amount;
        }
      }
    }

    return last14Days.map((day) => {
      return (
        groupedData[day] || {
          date: day,
          incomes: 0,
          expenses: 0,
        }
      );
    });
  }, [expenses, last14Days]);

  const total = React.useMemo(
    () => ({
      incomes: totalIncomes,
      expenses: totalExpenses,
    }),
    [totalIncomes, totalExpenses]
  );

  return (
    <Card className="p-0 gap-0 bg-transparent border-none shadow-none">
      <CardHeader className="pb-0 flex flex-col items-stretch space-y-0 border-b border-b-white/10 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className="text-white">Income vs Expenses</CardTitle>

          <CardDescription>
            Comparing income/expenses over the last 12 months
          </CardDescription>
        </div>
        <div className="flex">
          {["incomes", "expenses"].map((key) => {
            const chart = key as keyof typeof chartConfig;

            console.log(`Rendering chart: ${chart}`); // Debugging log
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="py-4 px-6 flex-1 cursor-pointer flex flex-col justify-center gap-1 text-white rounded-tl-[13px] rounded-tr-[13px]  text-left data-[active=true]:bg-white/10 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {String(chartConfig[chart].label)}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {formatMoney("GBP", total[chart])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={activeChart === "incomes" ? "#88DDE2" : "#F74949"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default IncomeExpenseLine;
