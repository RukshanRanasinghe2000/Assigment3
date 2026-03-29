import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { PurchaseBill } from '../models/purchase-bill.model';

export interface OfflineBill {
  localId: string;
  bill: PurchaseBill;
  status: 'pending' | 'synced';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class OfflineService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('purchase-mgmt', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline-bills')) {
          db.createObjectStore('offline-bills', { keyPath: 'localId' });
        }
      }
    });
  }

  async saveBillOffline(bill: PurchaseBill): Promise<string> {
    const db = await this.dbPromise;
    const localId = `offline_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const entry: OfflineBill = {
      localId,
      bill,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await db.put('offline-bills', entry);
    return localId;
  }

  async getPendingBills(): Promise<OfflineBill[]> {
    const db = await this.dbPromise;
    const all = await db.getAll('offline-bills');
    return all.filter(b => b.status === 'pending');
  }

  async markSynced(localId: string): Promise<void> {
    const db = await this.dbPromise;
    const entry = await db.get('offline-bills', localId);
    if (entry) {
      entry.status = 'synced';
      await db.put('offline-bills', entry);
    }
  }

  async getAllOfflineBills(): Promise<OfflineBill[]> {
    const db = await this.dbPromise;
    return db.getAll('offline-bills');
  }
}
