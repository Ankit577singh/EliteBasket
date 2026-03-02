import { useMemo, useCallback } from "react";
import { useExpenseStore } from "../store/useExpenseStore";

export function useExpenses() {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const total = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteExpense(id);
    },
    [deleteExpense]
  );

  return {
    expenses,
    total,
    handleDelete,
  };
}