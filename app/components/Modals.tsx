'use client';

import { useState } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ExportModalProps {
  expenses: Expense[];
}

export default function ExportModal({ expenses }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [dateRange, setDateRange] = useState<
    'all' | 'month' | 'last-month' | 'year' | 'custom'
  >('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    let filteredExpenses = [...expenses];

    if (dateRange !== 'all') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      if (dateRange === 'month') {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        });
      } else if (dateRange === 'last-month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === year;
        });
      } else if (dateRange === 'year') {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === currentYear;
        });
      } else if (dateRange === 'custom') {
        if (!startDate || !endDate) {
          alert('Please select both start and end dates');
          return;
        }
        filteredExpenses = filteredExpenses.filter(
          (expense) => expense.date >= startDate && expense.date <= endDate
        );
      }
    }

    if (filteredExpenses.length === 0) {
      alert('No expenses to export with the current filters');
      return;
    }

    if (format === 'csv') {
      exportToCSV(filteredExpenses);
    } else {
      exportToJSON(filteredExpenses);
    }

    setIsOpen(false);
  };

  const exportToCSV = (expensesToExport: Expense[]) => {
    const categoryNames: { [key: string]: string } = {
      food: 'Food & Dining',
      transport: 'Transportation',
      housing: 'Housing',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      utilities: 'Utilities',
      other: 'Other',
    };

    let csv = 'Date,Description,Category,Amount\n';
    expensesToExport.forEach((expense) => {
      csv += `"${expense.date}","${expense.name.replace(/"/g, '""')}","${categoryNames[expense.category]}",${expense.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (expensesToExport: Expense[]) => {
    const data = {
      exportedAt: new Date().toISOString(),
      expenseCount: expensesToExport.length,
      totalAmount: expensesToExport.reduce((sum, exp) => sum + exp.amount, 0),
      expenses: expensesToExport,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow flex items-center"
      >
        <FontAwesomeIcon icon={['fas', 'file-export']} className="mr-2" /> Export
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Export Expenses</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Format
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="csv"
                        checked={format === 'csv'}
                        onChange={() => setFormat('csv')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>CSV (Excel, Numbers)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="json"
                        checked={format === 'json'}
                        onChange={() => setFormat('json')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>JSON (For developers)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) =>
                      setDateRange(
                        e.target.value as 'all' | 'month' | 'last-month' | 'year' | 'custom'
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Expenses</option>
                    <option value="month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div
                  className={`${dateRange === 'custom' ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-2 gap-3`}
                >
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}