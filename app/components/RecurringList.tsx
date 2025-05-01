'use client';

import { useState } from 'react';
import {
  faFilter,
  faEdit,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { RecurringPayment } from '../types';
import { formatCurrency, getCategoryIcon } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface RecurringListProps {
  recurringPayments: RecurringPayment[];
  setRecurringPayments: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
}

export default function RecurringList({
  recurringPayments,
  setRecurringPayments,
}: RecurringListProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);

  const filteredPayments = recurringPayments
    .filter((payment) => categoryFilter === 'all' || payment.category === categoryFilter)
    .filter((payment) =>
      statusFilter === 'all' ? true : statusFilter === 'active' ? payment.active : !payment.active
    );

  const activePayments = recurringPayments.filter((p) => p.active);
  const monthlyTotal = activePayments.reduce((sum, payment) => {
    if (payment.frequency === 'monthly') return sum + payment.amount;
    if (payment.frequency === 'weekly') return sum + payment.amount * 4;
    if (payment.frequency === 'bi-weekly') return sum + payment.amount * 2;
    if (payment.frequency === 'daily') return sum + payment.amount * 30;
    if (payment.frequency === 'quarterly') return sum + payment.amount / 3;
    if (payment.frequency === 'yearly') return sum + payment.amount / 12;
    return sum + payment.amount;
  }, 0);

  const categoryNames: { [key: string]: string } = {
    food: 'Food & Dining',
    transport: 'Transportation',
    housing: 'Housing',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    utilities: 'Utilities',
    other: 'Other',
  };

  const frequencyNames: { [key: string]: string } = {
    daily: 'Daily',
    weekly: 'Weekly',
    'bi-weekly': 'Bi-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };

  const handleEdit = (payment: RecurringPayment) => {
    setEditingPayment(payment);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    const updatedPayment: RecurringPayment = {
      ...editingPayment,
      name: (document.getElementById('editRecurringName') as HTMLInputElement).value.trim(),
      amount: parseFloat(
        (document.getElementById('editRecurringAmount') as HTMLInputElement).value
      ),
      category: (document.getElementById('editRecurringCategory') as HTMLSelectElement).value,
      frequency: (document.getElementById('editRecurringFrequency') as HTMLSelectElement).value,
      startDate: (document.getElementById('editRecurringStartDate') as HTMLInputElement).value,
      active: (document.getElementById('editRecurringActive') as HTMLInputElement).checked,
    };

    if (
      !updatedPayment.name ||
      isNaN(updatedPayment.amount) ||
      updatedPayment.amount <= 0 ||
      !updatedPayment.startDate
    ) {
      alert('Please fill all fields with valid values');
      return;
    }

    setRecurringPayments((prev) => {
      const updatedPayments = prev.map((p) =>
        p.id === updatedPayment.id ? updatedPayment : p
      );
      localStorage.setItem('recurringPayments', JSON.stringify(updatedPayments));
      return updatedPayments;
    });
    setEditingPayment(null);
  };

  const handleDelete = () => {
    if (!editingPayment || !confirm('Are you sure you want to delete this recurring payment?')) {
      return;
    }
    setRecurringPayments((prev) => {
      const updatedPayments = prev.filter((p) => p.id !== editingPayment.id);
      localStorage.setItem('recurringPayments', JSON.stringify(updatedPayments));
      return updatedPayments;
    });
    setEditingPayment(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recurring Payments</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 hover:bg-opacity-30 px-3 py-1 rounded-lg flex items-center"
              >
                <FontAwesomeIcon icon={faFilter} className="mr-1" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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

        {/* Summary */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Total Recurring Payments</div>
              <div className="text-xl font-semibold">
                {formatCurrency(monthlyTotal)}/month
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="text-right">
                <div className="text-sm text-gray-500">Active</div>
                <div className="font-medium">{activePayments.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Inactive</div>
                <div className="font-medium">
                  {recurringPayments.length - activePayments.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Payments List */}
        <div className="divide-y">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No recurring payments found</h3>
              <p className="text-gray-500">Try changing your filters</p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50 fade-in">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full category-${payment.category} flex items-center justify-center text-white mt-1`}
                    >
                      <FontAwesomeIcon icon={getCategoryIcon(payment.category) as IconProp} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{payment.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{categoryNames[payment.category]}</span>
                        <span>•</span>
                        <span>{frequencyNames[payment.frequency]}</span>
                        <span>•</span>
                        <span>
                          Started{' '}
                          {new Date(payment.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">-{formatCurrency(payment.amount)}</div>
                    <div
                      className={`text-xs ${
                        payment.active ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {payment.active ? 'Active' : 'Inactive'}
                    </div>
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Recurring Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Recurring Payment</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="editRecurringName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="editRecurringName"
                  defaultValue={editingPayment.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editRecurringAmount"
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
                    id="editRecurringAmount"
                    defaultValue={editingPayment.amount}
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editRecurringCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="editRecurringCategory"
                  defaultValue={editingPayment.category}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(categoryNames).map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryNames[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editRecurringFrequency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Frequency
                </label>
                <select
                  id="editRecurringFrequency"
                  defaultValue={editingPayment.frequency}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(frequencyNames).map((freq) => (
                    <option key={freq} value={freq}>
                      {frequencyNames[freq]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editRecurringStartDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="editRecurringStartDate"
                  defaultValue={editingPayment.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="editRecurringActive"
                  defaultChecked={editingPayment.active}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="editRecurringActive"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active
                </label>
              </div>
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}