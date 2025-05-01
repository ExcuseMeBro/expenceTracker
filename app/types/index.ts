export interface Expense {
    id: number;
    name: string;
    amount: number;
    category: string;
    date: string;
  }
  
  export interface RecurringPayment {
    id: number;
    name: string;
    amount: number;
    category: string;
    frequency: string;
    startDate: string;
    active: boolean;
    lastProcessed: string | null;
  }