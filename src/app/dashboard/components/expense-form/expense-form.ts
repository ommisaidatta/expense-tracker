import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense , ExpenseService } from '../../../services/expense-service';
@Component({
  selector: 'app-expense-form',
  standalone:true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss'
})
export class ExpenseForm {
  expenseForm! : FormGroup;

  constructor(private fb: FormBuilder,private txnService: ExpenseService) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: [null,[Validators.required, Validators.min(1)]],
      category: ['select', Validators.required],
      date: ['',Validators.required]
    });
  }

  onSubmit() {
    if (this.expenseForm.invalid) return;

    const formData = this.expenseForm.value;

    const type = formData.category === 'income' ? 'income' : 'expense';

    const txn: Expense = {
    id: Date.now(),
    title: formData.title,
    amount: +formData.amount,
    category: formData.category,
    date: formData.date,
    type: type, 
  };

  const newTxn: Expense = {
    id: Date.now(),
    title: this.expenseForm.value.title,
    amount: +this.expenseForm.value.amount,
    category: this.expenseForm.value.category,
    date: this.expenseForm.value.date,
    type: this.expenseForm.value.type
  };

    this.txnService.addTransaction(txn);

    this.expenseForm.reset({
      category: 'select',
    });
  }
}
