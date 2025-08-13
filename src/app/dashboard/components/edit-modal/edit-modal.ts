import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseService } from '../../../services/expense-service';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.html',
  styleUrl: './edit-modal.scss'
})
export class EditModal implements OnChanges {
  @Input() transaction?: Expense;
  @Output() closeModal = new EventEmitter<void>();

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['select', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transaction'] && this.transaction) {
      this.editForm.patchValue(this.transaction);
    }
  }

  onSubmit() {
    if (this.editForm.invalid || !this.transaction) return;

    const formData = this.editForm.value;
    const type = formData.category === 'income' ? 'income' : 'expense';

    const updatedTransaction: Expense = {
      id: this.transaction.id,
      title: formData.title,
      amount: +formData.amount,
      category: formData.category,
      date: formData.date,
      type: type
    };

    this.expenseService.updateTransaction(updatedTransaction);
    this.closeModal.emit();
  }

  onCancel() {
    this.closeModal.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
} 