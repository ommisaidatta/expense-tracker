import { Component } from '@angular/core';
import { ExpenseForm } from "./components/expense-form/expense-form";
import { SummaryChart } from "./components/summary-chart/summary-chart";
import { TransactionList } from "./components/transaction-list/transaction-list";
import { EditModal } from "./components/edit-modal/edit-modal";
import { Expense } from '../services/expense-service';

@Component({
  selector: 'app-dashboard',
  imports: [ExpenseForm, SummaryChart, TransactionList, EditModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  public months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public yearlyIncome: number[] = [200, 300, 250, 400, 500, 550, 600, 700, 800, 900, 850, 1000];
  public yearlyExpense: number[] = [150, 200, 180, 300, 320, 350, 400, 420, 450, 500, 480, 600];


  selectedTransaction: Expense | undefined = undefined;

  onEditTransaction(txn: Expense) {
    this.selectedTransaction = txn;
  }

  onCloseModal() {
    this.selectedTransaction = undefined;
  }
}
