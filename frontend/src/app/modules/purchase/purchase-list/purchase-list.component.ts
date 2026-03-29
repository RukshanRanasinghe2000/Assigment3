import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getPurchaseBills().subscribe({
      next: (data) => {
        this.bills = Array.isArray(data) ? data : (data as any)?.value ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[List] error:', err.status, err.statusText);
        this.error = `Failed to load bills. ${err.status} ${err.statusText}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
