import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../types';

const EXPENSES_COLLECTION = 'expenses';
const BUDGET_COLLECTION = 'budgets';

export async function addExpense(expense: Expense) {
  try {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expense);
    return { ...expense, id: docRef.id };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

export async function getExpenses() {
  try {
    const q = query(collection(db, EXPENSES_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    })) as unknown as Expense[];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
}

export async function updateExpense(expense: Expense) {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expense.id.toString());
    await updateDoc(expenseRef, {
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
    return expense;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

export async function deleteExpense(expenseId: string | number) {
  try {
    await deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId.toString()));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

export async function saveBudget(budget: number) {
  try {
    await setDoc(doc(db, BUDGET_COLLECTION, 'monthly'), { amount: budget });
    return budget;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
}

export async function getBudget() {
  try {
    const budgetDoc = await getDocs(collection(db, BUDGET_COLLECTION));
    const budget = budgetDoc.docs[0]?.data();
    return budget?.amount || 0;
  } catch (error) {
    console.error('Error getting budget:', error);
    return 0;
  }
}