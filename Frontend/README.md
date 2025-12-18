# Stock Management System - Frontend

Modern Angular 18 frontend application for managing inventory, orders, deliveries, and personnel.

## Features

- 📦 **Article Management**: Add, edit, delete, and track inventory articles
- 👥 **Client Management**: Manage customer information
- 📋 **Order Management**: Create and track orders with multiple articles
- 🚚 **Delivery Management**: Assign deliveries to personnel and track status
- 👨‍💼 **Personnel Management**: Manage employees and delivery personnel

## Technologies

- Angular 18 (Standalone Components)
- TypeScript 5.5
- RxJS 7.8
- Modern CSS with Flexbox/Grid

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── articles/
│   │   │   │   └── article-list/
│   │   │   ├── clients/
│   │   │   │   └── client-list/
│   │   │   ├── commandes/
│   │   │   │   └── commande-list/
│   │   │   ├── livraisons/
│   │   │   │   └── livraison-list/
│   │   │   └── personnel/
│   │   │       └── personnel-list/
│   │   ├── models/
│   │   │   ├── article.model.ts
│   │   │   ├── client.model.ts
│   │   │   ├── commande.model.ts
│   │   │   ├── livraison.model.ts
│   │   │   └── personnel.model.ts
│   │   ├── services/
│   │   │   ├── article.service.ts
│   │   │   ├── client.service.ts
│   │   │   ├── commande.service.ts
│   │   │   ├── livraison.service.ts
│   │   │   └── personnel.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## API Endpoints

The frontend expects the following API endpoints from the backend:

- **Articles**: `GET|POST /api/articles`, `GET|PUT|DELETE /api/articles/:id`
- **Clients**: `GET|POST /api/clients`, `GET|PUT|DELETE /api/clients/:id`
- **Commandes**: `GET|POST /api/commandes`, `GET|PUT|DELETE /api/commandes/:id`
- **Livraisons**: `GET|POST /api/livraisons`, `GET|PUT|DELETE /api/livraisons/:id`
- **Personnel**: `GET|POST /api/personnel`, `GET|PUT|DELETE /api/personnel/:id`

## Features Overview

### Articles

- View all articles with quantity and price
- Add new articles
- Edit existing articles
- Delete articles
- Search functionality

### Clients

- Manage client information (name, email, phone, address)
- Search clients
- Full CRUD operations

### Orders (Commandes)

- Create orders with multiple articles
- Select client and add articles dynamically
- Automatic total calculation
- Order status tracking (en cours, Validée, annulée)

### Deliveries (Livraisons)

- Assign deliveries to delivery personnel
- Track delivery status (en attente, en cours, livrée, annulée)
- Set payment modes
- Schedule delivery dates

### Personnel

- Manage employees and delivery personnel
- Role-based categorization (administrateur, livreur, employé)
- Contact information management

## Build

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Development

- Run `npm start` for a dev server
- Navigate to `http://localhost:4200/`
- The application will automatically reload if you change any source files

## Notes

- Make sure the backend API is running before starting the frontend
- Update the API URL in service files if your backend runs on a different port
- All components use Angular standalone components (no modules required)
- Forms use template-driven approach with two-way binding
