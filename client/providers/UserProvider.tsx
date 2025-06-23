"use client";
import React from "react";
import { UserContextProvider } from "../context/userContext";
import { ExpenseContextProvider } from "../context/expenseContext";

interface Props {
  children: React.ReactNode;
}

function UserProvider({ children }: Props) {
  return (
    <UserContextProvider>
      <ExpenseContextProvider>{children}</ExpenseContextProvider>
    </UserContextProvider>
  );
}

export default UserProvider;
