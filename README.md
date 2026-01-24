# POS Web Frontend

A modern, high-performance, and responsive Point of Sale (POS) system built with React 19 and Vite. This frontend provides a seamless experience for both administrators and sales associates.

## 🚀 Core Features & Pages

### 1. Unified Dashboard
- **Real-time Analytics**: Visual representation of sales trends and performance metrics.
- **Quick Stats**: At-a-glance view of total revenue, orders, and customer growth.
- **Activity Feed**: Recent transactions and system updates.

### 2. POS Interface (Sales Hub)
- **Fast Checkout**: Optimized for speed with quick product search and category filtering.
- **Dynamic Cart**: Real-time price calculation including tax and discounts.
- **Multiple Payment Modes**: Support for Cash, Card, and Digital wallets.

### 3. Inventory & Product Management
- **Product Directory**: Detailed list view with image support and stock tracking.
- **Advanced Forms**: Add or edit products with multi-category support and pricing rules.
- **Search & Filtering**: Robust search capabilities to locate items instantly.

### 4. Order & Transaction History
- **Comprehensive Logs**: View all past orders with detailed status (Completed, Pending, Cancelled).
- **Invoice Management**: Ability to view and reprint transaction receipts.

### 5. Customer Relationship Management (CRM)
- **Customer Profiles**: Store and manage customer contact details and purchase history.
- **Loyalty Tracking**: Monitor customer engagement and frequent buyers.

### 6. Authentication & Security
- **Secure Login**: Protected admin panel with session management.
- **Landing Page**: Professional introduction for public-facing access.

### 7. System Settings
- **Customization**: Manage company profile, business hours, and tax settings.
- **Theming**: Toggle between Light and Dark modes for better accessibility.

## 🛠️ Tech Stack & Architecture

### Frontend Technologies
- **React 19**: Utilizing the latest features for better performance and state handling.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent styling.
- **Framer Motion**: Powerful animation library for smooth UI transitions.
- **Lucide React**: Modern and clean icon set.

### State Management (Global Contexts)
- **AuthContext**: Manages user authentication state and admin access.
- **CartContext**: Handles the shopping cart logic, including adding items and quantity adjustments.
- **ProductContext**: Centralized store for inventory data, shared across the POS and Product pages.
- **ThemeContext**: Persists user preferences for Dark/Light mode.

### UI Architecture
- **Layout System**: A flexible wrapper providing consistent Sidebar and Header placement.
- **Component Patterns**: Reusable atomic components for buttons, cards, and data tables.

## 📂 Project Structure
```bash
/src
  ├── components/  # Reusable UI elements (Buttons, Inputs, etc.)
  ├── context/     # Global state providers
  ├── pages/       # Full page views
  ├── assets/      # Global styles and static files
  └── App.jsx      # Main application router and provider setup
```

## 🚥 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
