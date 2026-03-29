# Purchase Management System

A full-stack purchase bill management application built with ASP.NET Core 10 (backend) and Angular 21 (frontend). It supports creating and editing purchase bills, tracking audit logs, and saving bills offline when the network is unavailable.

---

## Tech Stack

- Backend: ASP.NET Core 10, Entity Framework Core, MySQL
- Frontend: Angular 21, IndexedDB (via `idb`) for offline support
- Database: MySQL

---

## Project Structure

```
/
├── backend/                  # ASP.NET Core Web API
│   ├── Controllers/          # API route handlers
│   ├── Services/             # Business logic layer
│   ├── Repositories/         # Data access layer
│   ├── Entities/             # EF Core entity models
│   ├── DTOs/                 # Data transfer objects
│   ├── Data/                 # DbContext
│   └── Migrations/           # EF Core migrations
└── frontend/                 # Angular SPA
    └── src/app/
        ├── core/             # Services, models, interceptors
        ├── modules/purchase/ # Purchase bills & audit log pages
        └── shared/           # Pipes, shared components
```

---

## Architecture

```mermaid
graph TD
    A[Angular Frontend] -->|HTTP REST| B[ASP.NET Core API]
    B --> C[Service Layer]
    C --> D[Repository Layer]
    D --> E[(MySQL Database)]
    C --> F[Audit Log Repository]
    F --> E
    A -->|Offline| G[(IndexedDB)]
    G -->|Sync on reconnect| B
```

---

## Data Model

```mermaid
erDiagram
    PurchaseBill {
        int Id PK
        string BillNumber
        datetime BillDate
        string SupplierName
        string Notes
        datetime CreatedAt
        datetime UpdatedAt
    }
    PurchaseBillItem {
        int Id PK
        int PurchaseBillId FK
        int ItemId FK
        int LocationId FK
        decimal Cost
        decimal Price
        int Quantity
        decimal DiscountPercent
        decimal TotalCost
        decimal TotalSelling
    }
    Item {
        int Id PK
        string Name
    }
    Location {
        int Id PK
        string Code
        string Name
    }
    AuditLog {
        int Id PK
        string Entity
        string Action
        string OldValue
        string NewValue
        datetime CreatedAt
    }

    PurchaseBill ||--o{ PurchaseBillItem : "has"
    PurchaseBillItem }o--|| Item : "references"
    PurchaseBillItem }o--|| Location : "references"
```

---

## API Endpoints

```mermaid
graph LR
    subgraph Purchase Bills
        G1[GET /api/purchase-bill]
        G2[GET /api/purchase-bill/:id]
        P1[POST /api/purchase-bill]
        P2[PUT /api/purchase-bill/:id]
    end
    subgraph Items
        G3[GET /api/items]
    end
    subgraph Locations
        G4[GET /api/locations]
    end
    subgraph Audit
        G5[GET /api/audit-logs]
    end
```

---

## Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/purchase` | PurchaseListComponent | List all purchase bills |
| `/purchase/new` | PurchaseFormComponent | Create a new bill |
| `/purchase/edit/:id` | PurchaseFormComponent | Edit an existing bill |
| `/audit` | AuditLogComponent | View audit history |

---

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 20+ and npm
- MySQL server

### Backend Setup

1. Copy the environment file and fill in your database credentials:

```bash
cp backend/.env.example backend/.env
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=PurchaseManagementDB
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

2. Run the API (migrations are applied automatically on startup):

```bash
cd backend
dotnet run
```

The API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

---

## Offline Support

When the network is unavailable, purchase bills are saved locally in IndexedDB under the `purchase-mgmt` database. Pending bills are synced back to the server when connectivity is restored.

```mermaid
sequenceDiagram
    participant User
    participant Angular
    participant IndexedDB
    participant API

    User->>Angular: Submit purchase bill
    alt Online
        Angular->>API: POST /api/purchase-bill
        API-->>Angular: 201 Created
    else Offline
        Angular->>IndexedDB: Save bill (status: pending)
        IndexedDB-->>Angular: localId returned
    end

    Note over Angular,API: On reconnect
    Angular->>IndexedDB: Get pending bills
    IndexedDB-->>Angular: pending bills[]
    Angular->>API: POST /api/purchase-bill (each)
    Angular->>IndexedDB: Mark as synced
```

---

## Audit Logging

Every create and update operation on a purchase bill is recorded in the `AuditLog` table, storing the old and new JSON values for full change history.
