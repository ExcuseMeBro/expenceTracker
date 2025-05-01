'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { RecurringPayment } from '../types';

interface RecurringFormProps {
  setRecurringPayments: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
}

export default function RecurringForm({ setRecurringPayments }: RecurringFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || parseFloat(amount) <= 0 || !startDate) {
      alert('Please fill all fields with valid values');
      return;
    }

    const newPayment: RecurringPayment = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      category,
      frequency,
      startDate,
      active,
      lastProcessed: null,
    };

    setRecurringPayments((prev) => {
      const updatedPayments = [...prev, newPayment];
      localStorage.setItem('recurringPayments', JSON.stringify(updatedPayments));
      return updatedPayments;
    });

    setName('');
    setAmount('');
    setCategory('food');
    setFrequency('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setActive(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <h2 className="text-lg font-semibold">Add Recurring Payment</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label
            htmlFor="recurringName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="recurringName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Payment description"
            required
          />
        </div>
        <div>
          <label
            htmlFor="recurringAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              id="recurringAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="recurringCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="recurringCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="food">Food & Dining</option>
            <option value="transport">Transportation</option>
            <option value="housing">Housing</option>
            <option value="entertainment">Entertainment</option>
            <option value="shopping">Shopping</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="recurringFrequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frequency
          </label>
          <select
            id="recurringFrequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="recurringStartDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="recurringStartDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurringActive"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="recurringActive"
            className="ml-2 block text-sm text-gray-700"
          >
            Active
          </label>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> Add Recurring Payment
          </button>
        </div>
      </form>
    </div>
  );
}