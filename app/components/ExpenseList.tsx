'use client';

import { useState, useEffect } from 'react';
import { faFilter, faSortAmountDown, faTrashAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Expense } from '../types';
import { formatCurrency, getCategoryColor, getCategoryIcon } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ExpenseListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

export default function ExpenseList({ expenses, setExpenses }: ExpenseListProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleDelete = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = expenses
    .filter((expense) => categoryFilter === 'all' || expense.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const getChartData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const categories: { [key: string]: number } = {
      food: 0,
      transport: 0,
      housing: 0,
      entertainment: 0,
      shopping: 0,
      utilities: 0,
      other: 0,
    };

    monthlyExpenses.forEach((expense) => {
      categories[expense.category] += expense.amount;
    });

    const maxValue = Math.max(...Object.values(categories), 1);
    return Object.entries(categories)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        height: (amount / maxValue) * 100,
        color: getCategoryColor(category),
      }));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const lastMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === year;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryNames: { [key: string]: string } = {
    food: 'Food & Dining',
    transport: 'Transportation',
    housing: 'Housing',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    utilities: 'Utilities',
    other: 'Other',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-1" /> Filter
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faSortAmountDown} className="mr-1" /> Sort
            </button>
          </div>
        </div>
      </div>

      {/* Filter/Sort Dropdown */}
      <div className={`${showFilters ? '' : 'hidden'} bg-gray-50 p-3 border-b`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryNames).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryNames[cat]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Expenses Summary */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-xl font-semibold">{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="flex space-x-2">
            <div className="text-right">
              <div className="text-sm text-gray-500">This Month</div>
              <div className="font-medium">{formatCurrency(thisMonthExpenses)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Month</div>
              <div className="font-medium">{formatCurrency(lastMonthExpenses)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Chart */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Spending by Category</h3>
          <div className="text-sm text-gray-500">This Month</div>
        </div>
        <div className="h-40 flex items-end space-x-2">
          {getChartData().length > 0 ? (
            getChartData().map((data) => (
              <div
                key={data.category}
                className={`chart-bar flex-1 bg-${data.color}-500 rounded-t-lg hover:bg-${data.color}-600`}
                style={{ height: `${data.height}%` }}
                title={`${categoryNames[data.category]}: ${formatCurrency(data.amount)}`}
              ></div>
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 mt-2">No data available</div>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="divide-y">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <FontAwesomeIcon icon={faReceipt} className="text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No expenses found</h3>
            <p className="text-gray-500">Try changing your filters</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-gray-50 fade-in">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full category-${expense.category} flex items-center justify-center text-white mt-1`}
                  >
                    <FontAwesomeIcon icon={getCategoryIcon(expense.category) as IconProp} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{expense.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{categoryNames[expense.category]}</span>
                      <span>•</span>
                      <span>
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">-{formatCurrency(expense.amount)}</div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}