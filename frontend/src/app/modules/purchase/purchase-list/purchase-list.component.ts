import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TotalAmountPipe } from '../../../shared/pipes/total-amount.pipe';
import { ApiService } from '../../../core/services/api.service';
import { PurchaseBill } from '../../../core/models/purchase-bill.model';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TotalAmountPipe],
  templateUrl: './purchase-list.component.html'
})
export class PurchaseListComponent implements OnInit {
  bills: PurchaseBill[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getPurchaseBills().subscribe({
      next: data => { this.bills = data; this.loading = false; },
      error: () => { this.error = 'Failed to load bills.'; this.loading = false; }
    });
  }
}
