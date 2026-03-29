import { Pipe, PipeTransform } from '@angular/core';
import { PurchaseBillItem } from '../../core/models/purchase-bill.model';

@Pipe({ name: 'totalAmount', standalone: true })
export class TotalAmountPipe implements PipeTransform {
  transform(items: PurchaseBillItem[]): string {
    const total = items.reduce((s, i) => s + (i.totalSelling ?? i.price * i.quantity), 0);
    return total.toFixed(2);
  }
}
