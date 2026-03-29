import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PurchaseBill } from '../models/purchase-bill.model';

@Injectable({ providedIn: 'root' })
export class PdfService {
  generate(bill: PurchaseBill): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Purchase Bill', 14, 20);
    doc.setFontSize(11);
    doc.text(`Bill No: ${bill.billNumber}`, 14, 32);
    doc.text(`Date: ${new Date(bill.billDate).toLocaleDateString()}`, 14, 39);
    doc.text(`Supplier: ${bill.supplierName}`, 14, 46);
    if (bill.notes) doc.text(`Notes: ${bill.notes}`, 14, 53);

    // Items table
    autoTable(doc, {
      startY: 62,
      head: [['Item', 'Batch/Location', 'Cost', 'Price', 'Qty', 'Discount%', 'Total Cost', 'Total Selling']],
      body: bill.items.map(i => [
        i.itemName ?? '',
        i.locationName ?? '',
        i.cost.toFixed(2),
        i.price.toFixed(2),
        i.quantity,
        i.discountPercent.toFixed(2),
        (i.totalCost ?? 0).toFixed(2),
        (i.totalSelling ?? 0).toFixed(2)
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 82, 163] }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const totalQty = bill.items.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = bill.items.reduce((s, i) => s + (i.totalSelling ?? 0), 0);
    doc.setFontSize(11);
    doc.text(`Total Items: ${bill.items.length}`, 14, finalY);
    doc.text(`Total Quantity: ${totalQty}`, 14, finalY + 7);
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 14, finalY + 14);

    doc.save(`PurchaseBill_${bill.billNumber}.pdf`);
  }
}
