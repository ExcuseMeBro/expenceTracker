'use client';

import { useState } from 'react';
import { Expense, RecurringPayment } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ExpenseForm from './components/ExpenseForm';
import BudgetOverview from './components/BudgetOverview';
import ExpenseList from './components/ExpenseList';
import RecurringForm from './components/RecurringForm';
import UpcomingPayments from './components/UpcomingPayments';
import RecurringList from './components/RecurringList';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'regular' | 'recurring'>('regular');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(1500);

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