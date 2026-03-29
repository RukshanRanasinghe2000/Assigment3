import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">Purchase Management</div>
      <div class="nav-links">
        <a routerLink="/purchase" routerLinkActive="active">Purchase Bills</a>
        <a routerLink="/audit" routerLinkActive="active">Audit Logs</a>
      </div>
    </nav>
    <router-outlet />
  `
})
export class App {}
