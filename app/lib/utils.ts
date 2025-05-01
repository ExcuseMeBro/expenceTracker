import { Expense, RecurringPayment } from '../types';
import { faUtensils, IconDefinition, faCar, faHome, faCircle, faBolt, faShoppingBag, faFilm } from '@fortawesome/free-solid-svg-icons';

export function saveExpenses(expenses: Expense[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }
}

export function getExpenses(): Expense[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
  }
  return [];
}

export function saveRecurringPayments(payments: RecurringPayment[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('recurringPayments', JSON.stringify(payments));
  }
}

export function getRecurringPayments(): RecurringPayment[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('recurringPayments') || '[]');
  }
  return [];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getCategoryIcon(category: string): IconDefinition {
  const icons: { [key: string]: IconDefinition } = {
    food: faUtensils,
    transport: faCar,
    housing: faHome,
    entertainment: faFilm,
    shopping: faShoppingBag,
    utilities: faBolt,
    other: faCircle,
  };
  return icons[category] || faCircle;
}

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    food: 'red',
    transport: 'blue',
    housing: 'green',
    entertainment: 'yellow',
    shopping: 'purple',
    utilities: 'orange',
    other: 'gray',
  };
  return colors[category] || 'gray';
}