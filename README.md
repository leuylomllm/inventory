# Inventory Management API

A comprehensive inventory management system built with Node.js, Express, TypeScript, and MySQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (using mysql2)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **CORS**: cors
- **Environment**: dotenv

## Project Structure

```
inventory-api/
├── src/
│   ├── config/
│   │   └── db.ts              # Database configuration
│   ├── database/
│   │   └── inventory_db.sql   # Database schema and stored procedures
│   ├── inven-system/
│   │   ├── auth/              # Authentication handlers
│   │   ├── categories/        # Category management
│   │   ├── dashboard/         # Dashboard statistics
│   │   ├── orders/            # Order management
│   │   ├── products/          # Product management
│   │   ├── profile/           # User profile management
│   │   ├── stock_transactions/ # Stock transaction tracking
│   │   ├── suppliers/         # Supplier management
│   │   ├── users/             # User management
│   │   └── invenRoute.ts      # Main route definitions
│   ├── middleware/
│   │   └── authMiddleware.ts  # JWT authentication middleware
│   ├── routes/
│   │   └── index.ts           # Route registration
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   └── server.ts              # Application entry point
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

The system uses the following main tables:

- **tbl_categories**: Product categories
- **tbl_products**: Product inventory with category and supplier relationships
- **tbl_suppliers**: Supplier information
- **tbl_users**: User accounts with role-based access
- **tbl_roles**: User roles (admin, staff, customer)
- **tbl_permissions**: Granular permissions system
- **tbl_stock_transactions**: Stock movement tracking (Online, Offline, InStore)

## API Endpoints

Base URL: `/v1/api`

### Authentication
- `POST /webinven/data/auth/login` - User login
- `POST /webinven/data/auth/register` - User registration

### Products
- `GET /webinven/data/product/list` - Get all products (with filters)
- `GET /webinven/data/product/view/:id` - Get product by ID
- `POST /webinven/data/product` - Create new product
- `PUT /webinven/data/product/:id` - Update product
- `DELETE /webinven/data/product/delete/:id` - Delete product (soft delete)
- `POST /webinven/data/product/formload` - Load form data (categories, suppliers)

### Categories
- `GET /webinven/data/category/list` - Get all categories
- `GET /webinven/data/category/view/:id` - Get category by ID
- `POST /webinven/data/category` - Create new category
- `PUT /webinven/data/category/:id` - Update category
- `DELETE /webinven/data/category/delete/:id` - Delete category

### Suppliers
- `GET /webinven/data/supplier/list` - Get all suppliers
- `GET /webinven/data/supplier/view/:id` - Get supplier by ID
- `POST /webinven/data/supplier` - Create new supplier
- `PUT /webinven/data/supplier/:id` - Update supplier
- `DELETE /webinven/data/supplier/delete/:id` - Delete supplier

### Stock Transactions
- `GET /webinven/data/stock-transaction/list` - Get all stock transactions
- `GET /webinven/data/stock-transaction/view/:id` - Get transaction by ID
- `POST /webinven/data/stock-transaction` - Create stock transaction
- `PUT /webinven/data/stock-transaction/:id` - Update transaction
- `DELETE /webinven/data/stock-transaction/delete/:id` - Delete transaction

### Users
- `GET /webinven/data/user/list` - Get all users
- `GET /webinven/data/user/view/:id` - Get user by ID
- `POST /webinven/data/user` - Create new user
- `PUT /webinven/data/user/:id` - Update user
- `DELETE /webinven/data/user/delete/:id` - Delete user
- `POST /webinven/data/user/formload` - Load user form data
- `GET /webinven/data/user/profile` - Get current user profile
- `PUT /webinven/data/user/profile/:id` - Update user profile

### Orders
- `GET /webinven/data/order/list` - Get all orders
- `POST /webinven/data/order` - Create new order
- `DELETE /webinven/data/order/delete/:id` - Delete order

### Dashboard
- `GET /webinven/data/dashboard` - Get dashboard summary statistics

**Note**: All endpoints except authentication routes require JWT authentication via the `authMiddleware`.

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL server running
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=inventory_db
MYSQL_PORT=3306
PORT=3000
```

4. Import the database schema:
```bash
mysql -u your_username -p inventory_db < src/database/inventory_db.sql
```

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

## Features

- **Product Management**: Full CRUD operations for products with category and supplier relationships
- **Category Management**: Organize products into categories
- **Supplier Management**: Track supplier information
- **Stock Tracking**: Monitor stock movements with transaction types (Online, Offline, InStore)
- **User Management**: Role-based access control (admin, staff, customer)
- **Authentication**: Secure login/register with JWT and bcrypt password hashing
- **Dashboard**: Summary statistics for quick overview
- **Order Management**: Track and manage orders
- **Soft Delete**: Products are soft-deleted (isDeleted flag) for data integrity

## License

ISC