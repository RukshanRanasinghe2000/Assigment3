import { Component, OnInit } from '@angular/core';
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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAuditLogs().subscribe({
      next: data => { this.logs = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  toggle(id: number): void {
    this.expanded = this.expanded === id ? null : id;
  }
}
