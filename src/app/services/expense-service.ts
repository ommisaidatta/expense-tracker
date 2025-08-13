import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private transactionSubject = new BehaviorSubject<Expense[]>([]);
  transactions$ = this.transactionSubject.asObservable();

  constructor() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('transactions') : null;
    const initialTransactions = stored ? JSON.parse(stored) : [];
    this.transactionSubject.next(initialTransactions);
  }

  private saveToLocalStorage(transactions: Expense[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }

  getTransactions(): Expense[] {
    return this.transactionSubject.getValue();
  }

  addTransaction(txn: Expense) {
    txn.id = Date.now();
    const updated = [...this.getTransactions(), txn];
    this.transactionSubject.next(updated);
    this.saveToLocalStorage(updated);
  }

  deleteTransaction(id: number) {
    const updated = this.getTransactions().filter(txn => txn.id !== id);
    this.transactionSubject.next(updated);
    this.saveToLocalStorage(updated);
  }

  updateTransaction(updatedTxn: Expense) {
    const updated = this.getTransactions().map(txn =>
      txn.id === updatedTxn.id ? updatedTxn : txn
    );
    this.transactionSubject.next(updated);
    this.saveToLocalStorage(updated);
  }
}
