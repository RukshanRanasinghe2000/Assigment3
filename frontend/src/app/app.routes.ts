import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  {
    path: 'purchase',
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/purchase/purchase-list/purchase-list.component')
          .then(m => m.PurchaseListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./modules/purchase/purchase-form/purchase-form.component')
          .then(m => m.PurchaseFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./modules/purchase/purchase-form/purchase-form.component')
          .then(m => m.PurchaseFormComponent)
      }
    ]
  },
  {
    path: 'audit',
    loadComponent: () => import('./modules/purchase/audit-log/audit-log.component')
      .then(m => m.AuditLogComponent)
  }
];
