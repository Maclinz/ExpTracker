"use client";
import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExpenseContext } from "@/context/expenseContext";

export const description = "A line chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function ExpenseLineCHart() {
  const { dailyExpense } = useExpenseContext();

  console.log("ExpenseLineCHart dailyExpense", dailyExpense);

  const chartData = dailyExpense;

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
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
              tickFormatter={(value) => String(value).slice(0, 3)}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="balance"
              type="monotone"
              stroke="#FC4B4B"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ExpenseLineCHart;
