import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Expense, ExpenseService } from '../../../services/expense-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  @Output() editTxn = new EventEmitter<Expense>();

  transactions: Expense[] = [];
  displayedTransactions: Expense[] = [];
  loadcount = 5;

  showFilters = false;
  selectedCategory: string = 'all';
  startDate: string = '';
  endDate: string = '';
  availableCategories: string[] = [];
  tempSelectedCategory: string = 'all';
  tempStartDate: string = '';
  tempEndDate: string = '';

  constructor(private txnService: ExpenseService) {}

  ngOnInit() {
    this.txnService.transactions$.subscribe(txns => {
      this.transactions = txns.reverse();
      this.availableCategories = Array.from(new Set(txns.map(txn => txn.category)))
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.transactions;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(txn => txn.category === this.selectedCategory);
    }

    if (this.startDate) {
      const startDate = new Date(this.startDate);
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate;
      });
    }

    if (this.endDate) {
      const endDate = new Date(this.endDate);
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate <= endDate;
      });
    }

    this.displayedTransactions = filtered.slice(0, this.loadcount);
  }

  openFilters() {
    this.showFilters = true;
    this.tempSelectedCategory = this.selectedCategory;
    this.tempStartDate = this.startDate;
    this.tempEndDate = this.endDate;
  }

  applyFilterSettings() {
    this.selectedCategory = this.tempSelectedCategory;
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.applyFilters();
    this.showFilters = false;
  }

  cancelFilters() {
    this.tempSelectedCategory = this.selectedCategory;
    this.tempStartDate = this.startDate;
    this.tempEndDate = this.endDate;
    this.showFilters = false;
  }

  clearFilters() {
    this.selectedCategory = 'all';
    this.startDate = '';
    this.endDate = '';
    this.tempSelectedCategory = 'all';
    this.tempStartDate = '';
    this.tempEndDate = '';
    this.applyFilters();
    this.showFilters = false;
  }

  getFilteredCategories(): string[] {
    const predefinedCategories = ['income', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    return this.availableCategories.filter(cat => !predefinedCategories.includes(cat));
  }

  hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' || !!this.startDate || !!this.endDate;
  }

  loadMore() {
    this.loadcount += 5;
    this.displayedTransactions = this.transactions.slice(0, this.loadcount);
    this.applyFilters();
  }

  onDelete(txn: Expense) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.txnService.deleteTransaction(txn.id);
    }
  }

  onEdit(txn: Expense) {
    this.editTxn.emit(txn);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const filterWrapper = target.closest('.filter-wrapper');
    const filterCard = target.closest('.filter-card');
    
    if (this.showFilters && !filterWrapper && !filterCard) {
      this.cancelFilters();
    }
  }
  
}
