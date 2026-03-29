import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { OfflineService } from '../../../core/services/offline.service';
import { PdfService } from '../../../core/services/pdf.service';
import { Item } from '../../../core/models/item.model';
import { Location } from '../../../core/models/location.model';
import { PurchaseBill } from '../../../core/models/purchase-bill.model';
import { TotalAmountPipe } from '../../../shared/pipes/total-amount.pipe';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  form!: FormGroup;
  items: Item[] = [];
  locations: Location[] = [];
  filteredItems: Item[][] = [];
  activeTab = 'details';
  loading = false;
  saving = false;
  error = '';
  success = '';
  isEdit = false;
  billId?: number;
  isOnline = navigator.onLine;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private offline: OfflineService,
    private pdf: PdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadMasterData();
    this.listenOnlineStatus();

    this.billId = this.route.snapshot.params['id'];
    if (this.billId) {
      this.isEdit = true;
      this.loadBill(this.billId);
    } else {
      this.addRow();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      billNumber: ['', Validators.required],
      billDate: [new Date().toISOString().split('T')[0], Validators.required],
      supplierName: ['', Validators.required],
      notes: [''],
      items: this.fb.array([])
    });
  }

  private loadMasterData(): void {
    this.api.getItems().subscribe(data => this.items = data);
    this.api.getLocations().subscribe(data => this.locations = data);
  }

  private listenOnlineStatus(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPending();
    });
    window.addEventListener('offline', () => this.isOnline = false);
  }

  private loadBill(id: number): void {
    this.loading = true;
    this.api.getPurchaseBill(id).subscribe({
      next: bill => {
        this.form.patchValue({
          billNumber: bill.billNumber,
          billDate: bill.billDate.split('T')[0],
          supplierName: bill.supplierName,
          notes: bill.notes
        });
        bill.items.forEach((item, i) => {
          this.addRow();
          this.rowsArray.at(i).patchValue(item);
          this.filteredItems[i] = this.items;
        });
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load bill.'; this.loading = false; }
    });
  }

  get rowsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  newRow(): FormGroup {
    const row = this.fb.group({
      itemId: [null, Validators.required],
      itemSearch: [''],
      locationId: [null, Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      totalCost: [{ value: 0, disabled: true }],
      totalSelling: [{ value: 0, disabled: true }]
    });

    row.valueChanges.subscribe(() => this.recalcRow(row));
    return row;
  }

  addRow(): void {
    this.rowsArray.push(this.newRow());
    this.filteredItems.push([...this.items]);
  }

  removeRow(i: number): void {
    this.rowsArray.removeAt(i);
    this.filteredItems.splice(i, 1);
  }

  onItemSearch(i: number, value: string): void {
    // Clear itemId when user types again (forces re-selection)
    this.rowsArray.at(i).patchValue({ itemId: null }, { emitEvent: false });
    this.filteredItems[i] = value
      ? this.items.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
      : [];
  }

  selectItem(i: number, item: Item): void {
    this.rowsArray.at(i).patchValue({ itemId: item.id, itemSearch: item.name }, { emitEvent: false });
    this.filteredItems[i] = [];
  }

  private recalcRow(row: AbstractControl): void {
    const v = row.value;
    const cost = +v.cost || 0;
    const qty = +v.quantity || 0;
    const disc = +v.discountPercent || 0;
    const price = +v.price || 0;
    const totalCost = (cost * qty) - (cost * qty * disc / 100);
    const totalSelling = price * qty;
    row.get('totalCost')?.setValue(totalCost.toFixed(2), { emitEvent: false });
    row.get('totalSelling')?.setValue(totalSelling.toFixed(2), { emitEvent: false });
  }

  get summary() {
    const rows = this.rowsArray.controls;
    return {
      totalItems: rows.length,
      totalQty: rows.reduce((s, r) => s + (+r.value.quantity || 0), 0),
      totalAmount: rows.reduce((s, r) => s + (+r.get('totalSelling')?.value || 0), 0)
    };
  }

  private buildPayload(): PurchaseBill {
    const v = this.form.getRawValue();
    return {
      billNumber: v.billNumber,
      billDate: v.billDate,
      supplierName: v.supplierName,
      notes: v.notes ?? '',
      items: v.items.map((i: any) => ({
        itemId: Number(i.itemId),
        locationId: Number(i.locationId),
        cost: Number(i.cost) || 0,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        discountPercent: Number(i.discountPercent) || 0
      }))
    };
  }

  save(): void {
    this.form.markAllAsTouched();
    this.rowsArray.controls.forEach(r => (r as FormGroup).markAllAsTouched());

    if (this.form.invalid) {
      const errors: string[] = [];

      if (this.form.get('billNumber')?.invalid) errors.push('Bill Number');
      if (this.form.get('billDate')?.invalid) errors.push('Bill Date');
      if (this.form.get('supplierName')?.invalid) errors.push('Supplier Name');

      this.rowsArray.controls.forEach((r, i) => {
        const rowNum = `Row ${i + 1}`;
        if (!r.get('itemId')?.value) errors.push(`${rowNum}: Item`);
        if (!r.get('locationId')?.value) errors.push(`${rowNum}: Location`);
        if (r.get('cost')?.invalid) errors.push(`${rowNum}: Cost`);
        if (r.get('price')?.invalid) errors.push(`${rowNum}: Price`);
        if (r.get('quantity')?.invalid) errors.push(`${rowNum}: Quantity`);
      });

      this.error = errors.length
        ? `Please fill in the following required fields: ${errors.join(', ')}.`
        : 'Please fill in all required fields.';

      // Switch to header tab if header fields are invalid
      const headerInvalid = this.form.get('billNumber')?.invalid
        || this.form.get('billDate')?.invalid
        || this.form.get('supplierName')?.invalid;
      if (headerInvalid) this.activeTab = 'header';

      return;
    }

    this.error = '';
    const payload = this.buildPayload();

    if (!this.isOnline) {
      this.offline.saveBillOffline(payload).then(() => {
        this.success = 'Saved offline. Will sync when back online.';
      });
      return;
    }

    this.saving = true;
    const req = this.isEdit
      ? this.api.updatePurchaseBill(this.billId!, payload)
      : this.api.createPurchaseBill(payload);

    req.subscribe({
      next: () => {
        this.success = `Bill ${this.isEdit ? 'updated' : 'created'} successfully.`;
        this.saving = false;
        setTimeout(() => this.router.navigate(['/purchase']), 1200);
      },
      error: () => { this.error = 'Save failed.'; this.saving = false; }
    });
  }

  exportPdf(): void {
    const payload = this.buildPayload();
    // Enrich names for PDF
    payload.items = payload.items.map(i => ({
      ...i,
      itemName: this.items.find(x => x.id === i.itemId)?.name ?? '',
      locationName: this.locations.find(x => x.id === i.locationId)?.name ?? ''
    }));
    this.pdf.generate(payload);
  }

  private async syncPending(): Promise<void> {
    const pending = await this.offline.getPendingBills();
    for (const entry of pending) {
      this.api.createPurchaseBill(entry.bill).subscribe({
        next: () => this.offline.markSynced(entry.localId)
      });
    }
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
