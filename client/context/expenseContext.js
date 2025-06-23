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

  // handle input change
  const inputChange = (name) => (e) => {
    setTextInput({ ...textInput, [name]: e.target.value });
  };

  const handleInputChange = useCallback(inputChange, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await Promise.all([getIncomes(), getExpenses()]);
      }
    };

    fetchData();
  }, [userId]);

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
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => useContext(ExpenseContext);
