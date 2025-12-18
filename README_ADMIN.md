# MANSARA Admin Panel - Complete Documentation

## Overview

The MANSARA Foods Admin Panel is a comprehensive management system built with React, TypeScript, and Supabase. It allows non-technical users to manage products, orders, customers, and website content without needing any coding knowledge.

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (@tanstack/react-query)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (JWT)
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Key Components

#### AdminLayout (`src/components/admin/AdminLayout.tsx`)
- Main wrapper for all admin pages
- Provides sidebar navigation and top bar
- Handles authentication checks
- Responsive design for mobile/desktop

#### Admin Pages
- **Login** (`src/pages/admin/Login.tsx`) - Secure authentication
- **Dashboard** (`src/pages/admin/Dashboard.tsx`) - Business overview
- **Products** (`src/pages/admin/Products.tsx`) - Product listing
- **ProductEdit** (`src/pages/admin/ProductEdit.tsx`) - Add/edit products
- **Orders** (`src/pages/admin/Orders.tsx`) - Order management
- **Customers** (`src/pages/admin/Customers.tsx`) - Customer list
- **Offers** (`src/pages/admin/Offers.tsx`) - Offer management
- **Combos** (`src/pages/admin/Combos.tsx`) - Combo management
- **Content** (`src/pages/admin/Content.tsx`) - CMS pages
- **Banners** (`src/pages/admin/Banners.tsx`) - Banner management
- **Settings** (`src/pages/admin/Settings.tsx`) - Site configuration

## Detailed Features

### 1. Admin Login & Security

**Location**: `/admin/login`

**Features**:
- Email and password authentication
- Secure password hashing via Supabase
- JWT session management
- Admin user verification (must exist in `admin_users` table)

**How It Works**:
1. User enters credentials
2. System authenticates against `auth.users` table
3. System verifies user exists in `admin_users` with `is_active = true`
4. JWT token issued for session management
5. User redirected to dashboard

**Database Table**:
```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
```

### 2. Dashboard

**Location**: `/admin/dashboard`

**Features**:
- Total orders count
- Today's orders count
- Total products count
- Pending orders count
- Total customers count
- Quick action buttons
- Recent activity summary

**Queries Performed**:
```
- COUNT all products
- COUNT all orders
- COUNT all customers
- COUNT today's orders (filtered by date)
- COUNT pending orders (status = "pending")
```

### 3. Product Management

#### 3a. Product List Page
**Location**: `/admin/products`

**Features**:
- Table view of all products
- Product image thumbnails
- Search/filter by name or slug
- Status toggle (Active/Inactive)
- Edit and delete buttons
- Visibility flags display (Offer, New, Featured)

**Table Columns**:
- Image thumbnail
- Product name
- Category
- Price
- Stock quantity
- Visibility flags
- Current status
- Action buttons

**Bulk Operations**:
- Toggle multiple product statuses
- Search across all products
- Filter by category

#### 3b. Product Add/Edit Page
**Location**: `/admin/products/new` or `/admin/products/:id/edit`

**Sections**:

**Basic Information**:
- Product Name (required)
- Slug (auto-generated from name)
- Category selector (Porridge Mixes / Oil & Ghee)
- Sub-category (optional)

**Pricing & Stock**:
- Regular Price (required)
- Offer Price (optional)
- Stock Quantity (required)
- Weight/Size

**Product Content**:
- Short Description
- Full Description
- Ingredients list
- How to Use instructions
- Storage Instructions

**Media**:
- Product Image URL
- Live image preview

**Visibility Flags** (sidebar):
- Is Offer (checkbox) - Shows in /offers page
- Is New Arrival (checkbox) - Shows in /new-arrivals page
- Is Featured (checkbox) - Featured section
- Is Active (checkbox) - Visible to customers

**Auto-Generation Logic**:
```javascript
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
// Example: "Premium Ghee 500g" → "premium-ghee-500g"
```

**Database Operations**:
- Create: INSERT new product
- Edit: UPDATE existing product
- Delete: DELETE product (with confirmation)

### 4. Offers Management

**Location**: `/admin/offers`

**Features**:
- Display all products with `is_offer = true`
- Show regular price, offer price, and discount %
- Calculate discount automatically
- Edit button links to product edit page

**Discount Calculation**:
```javascript
const discount = Math.round(
  ((regularPrice - offerPrice) / regularPrice) * 100
);
// Example: (500-400)/500 = 20% OFF
```

**Page Logic**:
- Only shows products where `is_offer = true`
- Filters automatically from products table
- No separate management - edit through Products

### 5. Combos Management

**Location**: `/admin/combos`

**Features**:
- Grid view of combo offers
- Display combo price and savings
- Toggle combo status
- Edit button (placeholder for full editor)

**Combo Fields**:
- Combo Name
- Included Products
- Original Total Price
- Combo Price
- Savings Amount
- Active/Inactive status

### 6. Order Management

**Location**: `/admin/orders`

**Features**:
- Table view of all orders
- Order ID, customer name, date, amount
- Payment status badge
- Order status badge
- View details button
- Modal dialog for detailed view

**Order Statuses**:
- pending (gray) - Order received, not confirmed
- confirmed (secondary) - Customer confirmed
- packed (secondary) - Items packed
- shipped (primary) - Order shipped
- delivered (primary) - Delivered
- cancelled (red) - Cancelled order

**Order Details Modal**:
Shows:
- Order Information (ID, Date, Amount)
- Payment Status
- Order Status
- Customer Information (Name, Email, Phone, Address)
- Status update dropdown
- Real-time status change

**Database Operations**:
- SELECT all orders with sorting
- UPDATE order status
- SET updated_at timestamp

**Status Update Logic**:
```javascript
const statusOptions = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled"
];

// Admin can move order to any status
const updateOrderStatus = async (orderId, newStatus) => {
  await supabase
    .from("orders")
    .update({
      order_status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);
};
```

### 7. Customer Management

**Location**: `/admin/customers`

**Features**:
- Read-only customer list
- Search by name or email
- Total orders per customer
- Total amount spent per customer
- Automatic calculations

**Customer Data Display**:
- Name
- Email
- Phone Number
- Total Orders Count
- Total Spent (₹)

**Database Joins**:
```javascript
// Fetches customers with their related orders
const { data } = await supabase
  .from("customers")
  .select("*, orders(id, total_amount)")
  .order("created_at", { ascending: false });

// Calculates totals
const processedCustomers = data.map(customer => ({
  ...customer,
  totalOrders: customer.orders?.length || 0,
  totalSpent: customer.orders?.reduce(
    (sum, order) => sum + parseFloat(order.total_amount),
    0
  )
}));
```

### 8. Content Management (CMS)

**Location**: `/admin/content`

**Features**:
- Tab-based interface for different pages
- Rich text editing (plain text)
- Save content changes
- Last updated timestamp

**Editable Pages**:
- Home page content
- About Us page
- Why MANSARA page
- Contact page

**How It Works**:
1. Fetches all content pages from database
2. Displays tabs for each page
3. Admin can edit title and content
4. Save button updates database
5. Shows success/error messages

**Database Operations**:
```javascript
// Fetch all content pages
const { data } = await supabase
  .from("content_pages")
  .select("*");

// Update specific page
const { error } = await supabase
  .from("content_pages")
  .update({
    title: editingPage.title,
    content: editingPage.content,
    updated_at: new Date().toISOString()
  })
  .eq("id", editingPage.id);
```

### 9. Banner Management

**Location**: `/admin/banners`

**Features**:
- Placeholder for banner uploads
- Create new banners
- Basic banner structure ready for expansion

**Planned Features**:
- Image upload
- Select page (Home / Offers / New Arrivals)
- Set display order
- Enable/disable banners
- Auto-rotation toggle

### 10. Settings

**Location**: `/admin/settings`

**Features**:
- Two tab sections: General & Social Links

**General Settings**:
- Website Name
- Contact Email
- Phone Number
- Business Address

**Social Links**:
- Facebook URL
- Instagram URL
- Twitter URL

**Database Operations**:
```javascript
// Upsert settings (insert if not exists, update if does)
const { error } = await supabase
  .from("site_settings")
  .upsert([{ id: 1, ...settings }]);
```

## Product Visibility Logic

The visibility flags control where products appear on the frontend:

| Flag | Path | Display |
|------|------|---------|
| `is_active = true` | `/products` | All active products |
| `is_offer = true` | `/offers` | Only offer products |
| `is_new_arrival = true` | `/new-arrivals` | Only new arrivals |
| `is_featured = true` | `/` | Homepage featured section |

**Examples**:
- Product marked `is_offer = true` → appears in `/offers` page
- Product marked `is_new_arrival = true` → appears in `/new-arrivals` page
- Product marked `is_featured = true` → appears in homepage highlights
- All products with `is_active = true` → appear in `/products` page

## Authentication Flow

```
User visits /admin/login
         ↓
Enters email & password
         ↓
Check auth.users table (Supabase Auth)
         ↓
If valid, check admin_users table
         ↓
If admin user & is_active=true, issue JWT token
         ↓
Redirect to /admin/dashboard
         ↓
All pages check session on mount
         ↓
If no valid session, redirect to /admin/login
```

## Database Schema

### Core Tables Required

```sql
-- admin_users (for admin access control)
- id (uuid, FK to auth.users)
- email (text, unique)
- full_name (text)
- role (text)
- is_active (boolean)

-- products
- id (uuid, PK)
- name (text)
- slug (text, unique)
- category (text)
- price (decimal)
- offer_price (decimal)
- stock (integer)
- image_url (text)
- is_offer (boolean)
- is_new_arrival (boolean)
- is_featured (boolean)
- is_active (boolean)

-- orders
- id (uuid, PK)
- customer_id (uuid, FK)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- customer_address (text)
- total_amount (decimal)
- payment_status (text)
- order_status (text)
- created_at (timestamp)
- updated_at (timestamp)

-- customers
- id (uuid, PK)
- name (text)
- email (text)
- phone (text)
- address (text)
- created_at (timestamp)

-- content_pages
- id (uuid, PK)
- slug (text, unique)
- title (text)
- content (text)
- updated_at (timestamp)

-- combos
- id (uuid, PK)
- name (text)
- price (decimal)
- discount_price (decimal)
- image_url (text)
- is_active (boolean)

-- site_settings
- id (integer, PK)
- website_name (text)
- contact_email (text)
- phone_number (text)
- address (text)
- facebook_url (text)
- instagram_url (text)
- twitter_url (text)
```

## Error Handling

All pages include error handling:
- Network errors show toast notifications
- Invalid data handled gracefully
- Loading states prevent double-submission
- Confirmation dialogs for destructive actions

Example:
```javascript
try {
  const { data, error } = await supabase
    .from("products")
    .select("*");
  if (error) throw error;
  setProducts(data);
} catch (error: any) {
  toast.error(error.message || "Failed to fetch products");
}
```

## Security Considerations

1. **Row Level Security (RLS)**: All tables should have RLS enabled
2. **Authentication**: Only authenticated users in `admin_users` can access
3. **JWT Sessions**: Automatic session management via Supabase
4. **Input Validation**: All forms validate before submission
5. **Password Security**: Passwords hashed by Supabase Auth
6. **CORS**: Supabase handles CORS automatically

## Performance Optimizations

1. **React Query**: Caches queries to reduce API calls
2. **Pagination**: Implement for large datasets
3. **Search**: Client-side filtering for small datasets
4. **Lazy Loading**: Images load with compression
5. **Bundle Size**: Code splitting not yet implemented (warning in build)

## Responsive Design

- **Mobile**: Sidebar collapses to icon menu
- **Tablet**: Sidebar with labels visible
- **Desktop**: Full sidebar with all features

## Future Enhancements

1. **Bulk Operations**: Import/export CSV
2. **Advanced Analytics**: Sales charts, trends
3. **Email Notifications**: Order confirmations, status updates
4. **Image Upload**: Direct image uploads instead of URLs
5. **Inventory Alerts**: Low stock notifications
6. **User Roles**: Different permission levels
7. **Activity Logs**: Track all admin actions
8. **Two-Factor Authentication**: Enhanced security

## Troubleshooting

### Admin can't login
- Verify user exists in `auth.users`
- Check user exists in `admin_users` table
- Verify `is_active = true`
- Check email matches exactly

### Products not showing
- Check `is_active = true`
- Verify image URL is valid
- Check product exists in database

### Orders not loading
- Verify `orders` table exists
- Check customer data is linked
- Verify timestamps are correct format

### Changes not saving
- Check database connection
- Verify table has correct schema
- Check for permission errors
- See browser console for specific errors

## Support & Maintenance

For issues or improvements:
1. Check ADMIN_QUICKSTART.md for common tasks
2. Review this document for feature details
3. Check browser console for errors
4. Verify database schema matches requirements
