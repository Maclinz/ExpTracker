import axios from "axios";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./userContext";

const ExpenseContext = createContext();
const baseUrl = "http://localhost:8000/api/v1";

export const ExpenseContextProvider = ({ children }) => {
  const userId = useUserContext().user._id;

  console.log("User ID from context:", userId);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingIncomes, setLoadingIncomes] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [monthlyIncomeTotals, setMonthlyIncomeTotals] = useState([]);
  const [dailyExpense, setDailyExpense] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  const [textInput, setTextInput] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
  });

  // get icnomes
  const getIncomes = async () => {
    setLoadingIncomes(true);
    try {
      const res = await axios.get(`${baseUrl}/incomes`);

      setIncomes(res.data);
    } catch (error) {
      console.log("Error fetching incomes:", error);
    } finally {
      setLoadingIncomes(false);
    }
  };

  const fetchTotalIncomes = async () => {
    try {
      const res = await axios.get(`${baseUrl}/incomes/total`);

      setTotalIncomes(res.data.total);
    } catch (error) {
      console.log("Error fetching total incomes:", error);
    }
  };

  // get expenses
  const getExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const res = await axios.get(`${baseUrl}/expenses`);

      setExpenses(res.data);
    } catch (error) {
      console.log("Error fetching incomes:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/expenses/total`);
      setTotalExpenses(res.data.total);
    } catch (error) {
      console.log("Error fetching total expenses:", error);
    }
  };

  // add income
  const addIncome = async (income) => {
    if (!income.title || !income.amount) {
      toast.error("Title and amount are required!");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/income`, income);
      toast.success("Income added successfully!");

      // reset text input
      setTextInput({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: "",
      });
    } catch (error) {
      console.log("Error adding income:", error);
    }
  };

  const addExpense = async (expense) => {
    if (!expense.title || !expense.amount) {
      toast.error("Title and amount are required!");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/expense`, expense);

      toast.success("Expense added successfully!");
      // reset text input
      setTextInput({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: "",
      });
    } catch (error) {
      console.log("Error adding expense:", error);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/income/${id}`);

      toast.success("Income deleted successfully!");

      // Refresh incomes after deletion
      getIncomes();
    } catch (error) {
      console.log("Error deleting income:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/expense/${id}`);
      toast.success("Expense deleted successfully!");
      // Refresh expenses after deletion
      getExpenses();
    } catch (error) {
      console.log("Error deleting expense:", error);
    }
  };

  // calculate total incomes for thw past 6 months
  const calculateMonthlyIncomeTotals = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDate = new Date();
    const monthlyTotals = [];

    for (let i = 5; i >= 0; i--) {
      // figure out the correct month and year
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      monthlyTotals.push({
        month: months[date.getMonth()],
        year: date.getFullYear(),
        total: 0,
      });
    }

    // aggregate incomes for the month --> last 6 months
    incomes.forEach((income) => {
      const incomeDate = new Date(income.date);
      const diffInMonths =
        (currentDate.getFullYear() - incomeDate.getFullYear()) * 12 +
        (currentDate.getMonth() - incomeDate.getMonth());

      // check if the income date is within the last 6 months
      if (diffInMonths >= 0 && diffInMonths <= 5) {
        const monthIndex = 5 - diffInMonths;
        monthlyTotals[monthIndex].total += income.amount;
      }
    });

    setMonthlyIncomeTotals(monthlyTotals);
  };

  // claculate dail balance --> 7 days
  const calculateDailyExpense = () => {
    const currentDate = new Date();
    const dailyExpenses = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i
      );

      dailyExpenses.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        balance: 0,
      });
    }

    // aggregate expenses for the last 7 days
    expenses.forEach((expense) => {
      if (expense.type !== "expense") return;

      const expenseDate = new Date(expense.date);

      // check if the expense date is within the last 7 days
      const diffInDays =
        (currentDate.getFullYear() - expenseDate.getFullYear()) * 365 +
        (currentDate.getMonth() - expenseDate.getMonth()) * 30 +
        (currentDate.getDate() - expenseDate.getDate());

      if (diffInDays >= 0 && diffInDays < 7) {
        const index = diffInDays;
        dailyExpenses[index].balance += expense.amount;
      }
    });

    setDailyExpense(dailyExpenses.reverse());
  };

  // handle input change
  const inputChange = (name) => (e) => {
    setTextInput({ ...textInput, [name]: e.target.value });
  };

  const handleInputChange = useCallback(inputChange, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await Promise.all([
          getIncomes(),
          getExpenses(),
          fetchTotalIncomes(),
          fetchTotalExpenses(),
        ]);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (incomes.length > 0) {
      calculateMonthlyIncomeTotals();
    }

    if (expenses.length > 0) {
      calculateDailyExpense();
    }

    setBalance(totalIncomes - totalExpenses);
  }, [incomes, expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        incomes,
        expenses,
        loadingIncomes,
        loadingExpenses,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        textInput,
        handleInputChange,
        monthlyIncomeTotals,
        dailyExpense,
        totalIncomes,
        totalExpenses,
        balance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => useContext(ExpenseContext);
