# LUXوّRY Fashion E-Commerce Platform

Welcome to **LUXوّRY Fashion**, a cutting-edge fashion e-commerce platform providing a premium shopping experience for trendsetting clothing. This project incorporates advanced features and a modern tech stack for seamless user experience and powerful admin functionality.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Database Models](#database-models)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
LUXوّRY Fashion is a fully-featured fashion store with customer-facing shopping and an admin dashboard. It supports user management, orders, product reviews, a shopping cart, payment gateways, and much more. The platform is built with scalability, security, and modern UI/UX principles in mind.

## Key Features
- **Customer Experience**
  - Browse products by category, brand, or collection.
  - Product detail pages with reviews and ratings.
  - Shopping cart and wishlist functionality.
  - Secure user authentication and account management.
  - Order history and real-time notifications.

- **Admin Dashboard**
  - Manage products, categories, and brands.
  - View and process orders, track order statuses.
  - Manage users, roles, and permissions.
  - Analytics and insights for sales performance.

- **Payment and Coupons**
  - Integrated payment gateways with Stripe, PayPal.
  - Support for discount coupons and promotional codes.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) with Server Actions
- **Backend**: Prisma with PostgreSQL
- **Authentication**: better-auth
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **Languages**: TypeScript

## Database Models
This project uses Prisma for database management with key models:
- **User**: Supports roles (ADMIN, CUSTOMER) and relations with orders, cart items, and reviews.
- **Product**: Includes variants, categories, reviews, and associations with images.
- **Order**: Tracks order items, addresses, payment status, and more.
- **Notification**: Provides real-time updates for users.
- **CartItem, WishlistItem, Review, Payment, Coupon, and Address** models are fully integrated.

Refer to the [schema](./prisma/schema.prisma) for detailed model definitions.

## Setup and Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/luxory-fashion.git
   cd luxory-fashion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Usage
- Visit `http://localhost:3000` to access the storefront.
- Access the admin dashboard at `http://localhost:3000/admin` (requires admin login).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Thank you for using **LUXوّRY Fashion**!
