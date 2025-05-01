'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Expense, RecurringPayment } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ExpenseForm from './components/ExpenseForm';
import BudgetOverview from './components/BudgetOverview';
import ExpenseList from './components/ExpenseList';
import RecurringForm from './components/RecurringForm';
import UpcomingPayments from './components/UpcomingPayments';
import RecurringList from './components/RecurringList';

import { getExpenses, getBudget } from './lib/firestore';
import { useAuth } from './lib/auth';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'regular' | 'recurring'>('regular');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedExpenses, fetchedBudget] = await Promise.all([
          getExpenses(),
          getBudget()
        ]);
        setExpenses(fetchedExpenses);
        setMonthlyBudget(fetchedBudget);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Header totalBalance={monthlyBudget - expenses.reduce((sum, exp) => sum + exp.amount, 0)} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={activeTab === 'regular' ? '' : 'hidden'}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseForm setExpenses={setExpenses} />
            <BudgetOverview
              monthlyBudget={monthlyBudget}
              monthlySpending={expenses.reduce((sum, exp) => sum + exp.amount, 0)}
              setMonthlyBudget={setMonthlyBudget}
            />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList expenses={expenses} setExpenses={setExpenses} />
          </div>
        </div>
      </div>
      <div className={activeTab === 'recurring' ? '' : 'hidden'}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RecurringForm setRecurringPayments={setRecurringPayments} />
            <UpcomingPayments recurringPayments={recurringPayments} />
          </div>
          <div className="lg:col-span-2">
            <RecurringList
              recurringPayments={recurringPayments}
              setRecurringPayments={setRecurringPayments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}