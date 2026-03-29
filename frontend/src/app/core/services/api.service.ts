import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
import { Location } from '../models/location.model';
import { AuditLog, PurchaseBill } from '../models/purchase-bill.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.base}/items`);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.base}/locations`);
  }

  getPurchaseBills(): Observable<PurchaseBill[]> {
    return this.http.get<PurchaseBill[]>(`${this.base}/purchase-bill`);
  }

  getPurchaseBill(id: number): Observable<PurchaseBill> {
    return this.http.get<PurchaseBill>(`${this.base}/purchase-bill/${id}`);
  }

  createPurchaseBill(bill: PurchaseBill): Observable<PurchaseBill> {
    return this.http.post<PurchaseBill>(`${this.base}/purchase-bill`, bill);
  }

  updatePurchaseBill(id: number, bill: PurchaseBill): Observable<PurchaseBill> {
    return this.http.put<PurchaseBill>(`${this.base}/purchase-bill/${id}`, bill);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.base}/audit-logs`);
  }
}
