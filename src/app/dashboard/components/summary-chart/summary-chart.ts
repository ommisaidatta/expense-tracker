import { Component, HostListener, OnInit } from '@angular/core';
import { ExpenseService, Expense } from '../../../services/expense-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./summary-chart.scss']
})
export class SummaryChart implements OnInit {
  transactions: Expense[] = [];
  filterExpenses: Expense[] = [];

  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  selectedYear = new Date().getFullYear();
  selectedMonth: string = '';
  selectedView: 'yearly' | 'monthly' = 'yearly';
  showDropdowns = false;

  years: number[] = [];
  months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];

  private subscription = new Subscription();

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    // Set current month as initial selection
    const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
    this.selectedMonth = currentMonth;
    
    this.generateYears();
    this.subscription.add(
      this.expenseService.transactions$.subscribe(transactions => {
        this.transactions = transactions;
        this.generateYears();
        this.updateChartData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  generateYears() {
    this.years = [];
    const yearsSet = new Set<number>();
    this.transactions.forEach(txn => {
      const year = new Date(txn.date).getFullYear();
      yearsSet.add(year);
    })

    this.years = Array.from(yearsSet).sort((a, b) => b - a);

    if (this.years.length === 0) {
      this.years.push(new Date().getFullYear());
    }

    if (!this.years.includes(this.selectedYear)) {
      this.selectedYear = this.years[0];
    }
  }

  setView(view: 'yearly' | 'monthly') {
    if (this.selectedView == view) {
      this.showDropdowns = !this.showDropdowns;
    } else {
    this.selectedView = view;
    this.showDropdowns = true;

    if (view === 'yearly') {
      this.selectedMonth = ''; 
    } else {
      // Set current month when switching to monthly view
      const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
      this.selectedMonth = currentMonth;
    }
  }

    this.updateChartData();
  }

  updateChartData() {
    
    if (!this.transactions.length) return;

    this.filterExpenses = this.transactions.filter(txn => {
      const txnDate = new Date(txn.date);
      const txnYear = txnDate.getFullYear();
      const txnMonth = ('0' + (txnDate.getMonth() + 1)).slice(-2);

      const isYearMatch = txnYear === +this.selectedYear;
      const isMonthMatch = this.selectedView === 'monthly' ? txnMonth === this.selectedMonth : true;

      return isYearMatch && isMonthMatch;
    });

    this.totalIncome = this.filterExpenses
      .filter(txn => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.totalExpenses = this.filterExpenses
      .filter(txn => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.balance = this.totalIncome - this.totalExpenses;

  }

  getIncomePercentage() {
    const total = this.totalIncome + this.totalExpenses;
    return total ? (this.totalIncome / total) * 100 : 0;
  }

  getExpensePercentage() {
    const total = this.totalIncome + this.totalExpenses;
    return total ? (this.totalExpenses / total) * 100 : 0;
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toFixed(2);
  }

  getIncomeCount(): number {
    return this.filterExpenses.filter(txn => txn.type === 'income').length;
  }

  getExpenseCount(): number {
    return this.filterExpenses.filter(txn => txn.type === 'expense').length;
  }

  hasNoTransactions(): boolean {
    return this.filterExpenses.length === 0;
  }

  getSelectedMonthName(): string {
    if (this.selectedView === 'yearly') {
      return this.selectedYear.toString();
    } else {
      const month = this.months.find(m => m.value === this.selectedMonth);
       return month ? `${month.label}` : this.selectedYear.toString();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
  const clickedInside = (event.target as HTMLElement).closest('.summary-controls');
  if (!clickedInside) {
    this.showDropdowns = false;
  }
  }
}
