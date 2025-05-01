'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RecurringPayment } from '../types';
import { formatCurrency, getCategoryIcon } from '../lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface UpcomingPaymentsProps {
  recurringPayments: RecurringPayment[];
}

export default function UpcomingPayments({ recurringPayments }: UpcomingPaymentsProps) {
  const now = new Date();
  const next30Days = new Date(now);
  next30Days.setDate(now.getDate() + 30);

  const upcomingPayments = recurringPayments
    .filter((payment) => payment.active)
    .map((payment) => {
      let nextDate = payment.lastProcessed
        ? new Date(payment.lastProcessed)
        : new Date(payment.startDate);

      switch (payment.frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'bi-weekly':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      return { ...payment, nextDate: nextDate.toISOString().split('T')[0] };
    })
    .filter((payment) => {
      const nextDate = new Date(payment.nextDate);
      return nextDate >= now && nextDate <= next30Days;
    })
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
        <h2 className="text-lg font-semibold">Upcoming Payments</h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {upcomingPayments.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No upcoming payments in the next 30 days
            </div>
          ) : (
            upcomingPayments.map((payment) => {
              const paymentDate = new Date(payment.nextDate);
              const formattedDate = paymentDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const daysUntil = Math.ceil(
                (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={payment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full category-${payment.category} flex items-center justify-center text-white`}
                      >
                        <FontAwesomeIcon
                          icon={getCategoryIcon(payment.category) as IconProp}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{payment.name}</h3>
                        <div className="text-xs text-gray-500">
                          {formattedDate} (in {daysUntil} day{daysUntil !== 1 ? 's' : ''})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">-{formatCurrency(payment.amount)}</div>
                      <div className="text-xs text-gray-500">{payment.frequency}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}