import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TotalAmountPipe } from '../../../shared/pipes/total-amount.pipe';
import { ApiService } from '../../../core/services/api.service';
import { PurchaseBill } from '../../../core/models/purchase-bill.model';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, RouterModule, TotalAmountPipe],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
  bills: PurchaseBill[] = [];
  loading = true;
  error = '';
  selectedBill: PurchaseBill | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getPurchaseBills().subscribe({
      next: (data) => {
        this.bills = Array.isArray(data) ? data : (data as any)?.value ?? [];
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Failed to load bills. (${err.status})`;
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  openView(bill: PurchaseBill): void {
    this.selectedBill = bill;
  }

  closeView(): void {
    this.selectedBill = null;
  }

  totalAmount(bill: PurchaseBill): number {
    return bill.items.reduce((s, i) => s + (i.totalSelling ?? 0), 0);
  }

  totalQty(bill: PurchaseBill): number {
    return bill.items.reduce((s, i) => s + (i.quantity ?? 0), 0);
  }
}
