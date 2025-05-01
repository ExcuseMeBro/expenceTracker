'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../lib/utils';

interface BudgetOverviewProps {
  monthlyBudget: number;
  monthlySpending: number;
  setMonthlyBudget: React.Dispatch<React.SetStateAction<number>>;
}

export default function BudgetOverview({
  monthlyBudget,
  monthlySpending,
  setMonthlyBudget,
}: BudgetOverviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(monthlyBudget.toString());

  const remainingBudget = Math.max(0, monthlyBudget - monthlySpending);
  const budgetPercentage = Math.min(100, (monthlySpending / monthlyBudget) * 100);
  const progressColor =
    budgetPercentage >= 100
      ? 'bg-red-500'
      : budgetPercentage > 80
      ? 'bg-yellow-500'
      : 'bg-green-500';

  const handleSaveBudget = () => {
    const parsedBudget = parseFloat(newBudget);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      alert('Please enter a valid budget amount');
      return;
    }
    setMonthlyBudget(parsedBudget);
    localStorage.setItem('monthlyBudget', parsedBudget.toString());
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
          <h2 className="text-lg font-semibold">Monthly Budget</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Budget</span>
              <span className="font-medium">{formatCurrency(monthlyBudget)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${progressColor}`}
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Spent this month</div>
              <div className="text-lg font-semibold">{formatCurrency(monthlySpending)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="text-lg font-semibold">{formatCurrency(remainingBudget)}</div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="mr-2" /> Edit Budget
            </button>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Monthly Budget</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="newBudgetAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monthly Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="newBudgetAmount"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    min="0"
                    step="1"
                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}