import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { useExpenseContext } from "@/context/expenseContext";

const chartConfig = {
  currentBalance: {
    label: "Balance",
  },
  allExpenses: {
    label: "Expenses",
  },
} satisfies ChartConfig;

function BalanceBarChart() {
  const { balance, totalExpenses } = useExpenseContext();

  const chartData = [
    {
      text: "currentBalance",
      amount: balance,
      fill: "#D5C6F5",
    },
    {
      text: "allExpenses",
      amount: totalExpenses,
      fill: "#FC4B4B",
    },
  ];
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="text"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BalanceBarChart;
