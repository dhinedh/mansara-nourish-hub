# MANSARA Admin Panel - Quick Start Guide

## Getting Started

The complete admin panel is ready to use at `/admin/login`

### Step 1: Create Admin User in Supabase

1. Go to your Supabase dashboard
2. Click "Authentication" → "Users"
3. Click "Add user" and create a new user with:
   - Email: `admin@mansarafoods.com`
   - Password: Your secure password
4. Copy the user's ID (UUID)

### Step 2: Add User to Admin Table

Go to Supabase SQL Editor and run:

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'YOUR_USER_ID_HERE',
  'admin@mansarafoods.com',
  'Admin User',
  'admin',
  true
);
```

Replace `YOUR_USER_ID_HERE` with the UUID copied in Step 1

### Step 3: Login

1. Visit `http://localhost:5173/admin/login` (or your app URL + `/admin/login`)
2. Enter email: `admin@mansarafoods.com`
3. Enter password: Your chosen password
4. Click "Login"

## Admin Panel Features

| Section | Purpose | Features |
|---------|---------|----------|
| **Dashboard** | Overview | Orders, products, customers, pending items |
| **Products** | Manage inventory | Add/edit/delete products, toggle status |
| **Offers** | Manage discounts | View & edit products marked as offers |
| **Combos** | Bundle management | View and manage combo offers |
| **Orders** | Fulfillment | View orders, update status, track payments |
| **Customers** | CRM | View customer list and purchase history |
| **Content** | CMS | Edit website pages (About, Why MANSARA, Contact) |
| **Banners** | Marketing | Upload and manage promotional banners |
| **Settings** | Configuration | Website name, contact info, social links |

## Common Tasks

### Add a New Product
1. Go to **Products** → Click **Add Product**
2. Fill in:
   - Product Name (slug auto-generates)
   - Category (Porridge Mixes or Oil & Ghee)
   - Price & Stock
   - Image URL
   - Visibility flags (Offer, New Arrival, Featured)
3. Click **Save Product**

### Update Order Status
1. Go to **Orders**
2. Click **View** on an order
3. In the dialog, select new status from dropdown:
   - Pending → Confirmed → Packed → Shipped → Delivered
4. Status updates automatically

### Create an Offer
1. Go to **Products** → Edit a product
2. Check **"Is Offer"** checkbox
3. Set **Offer Price**
4. Click **Save Product**
5. Product now appears in `/offers` and **Offers** section

### Create a Combo
1. Combos must be added via database (SQL)
2. Or use **Combos** section for basic management

### Edit Website Content
1. Go to **Content**
2. Select a page tab (Home, About, Why MANSARA, Contact)
3. Edit title and content
4. Click **Save Changes**

## Database Setup

If tables don't exist, run these migrations:

```sql
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  price decimal(10,2),
  offer_price decimal(10,2),
  stock integer,
  image_url text,
  is_offer boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Other tables (Orders, Customers, etc.) should already exist
```

## Troubleshooting

### "Unauthorized access" on login
- Make sure user is in `admin_users` table
- Check that `is_active` is set to `true`
- Verify you're using the correct user ID from auth

### Products not appearing
- Check that `is_active` is set to `true`
- Visit `/products` to see all active products

### Can't edit content
- Make sure `content_pages` table exists
- Add pages with slugs: `home`, `about`, `why-mansara`, `contact`

## Security Notes

- Admin login uses Supabase JWT authentication
- Only users in `admin_users` table can access admin panel
- Set strong passwords for admin accounts
- Consider enabling 2FA in Supabase for extra security

## Contact & Support

For issues or questions about the admin panel, refer to:
- `README_ADMIN.md` - Detailed documentation
- `ADMIN_PANEL_GUIDE.md` - Feature overview
