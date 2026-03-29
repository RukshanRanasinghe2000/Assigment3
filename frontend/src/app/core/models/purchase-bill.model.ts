export interface PurchaseBillItem {
  id?: number;
  itemId: number;
  itemName?: string;
  locationId: number;
  locationName?: string;
  cost: number;
  price: number;
  quantity: number;
  discountPercent: number;
  totalCost?: number;
  totalSelling?: number;
}

export interface PurchaseBill {
  id?: number;
  billNumber: string;
  billDate: string;
  supplierName: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
  items: PurchaseBillItem[];
}

export interface AuditLog {
  id: number;
  entity: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}
