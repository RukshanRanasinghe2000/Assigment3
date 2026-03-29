import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuditLog } from '../../../core/models/purchase-bill.model';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log.component.html'
})
export class AuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  expanded: number | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAuditLogs().subscribe({
      next: data => {
        this.logs = Array.isArray(data) ? data : (data as any)?.value ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  toggle(id: number): void {
    this.expanded = this.expanded === id ? null : id;
  }
}
