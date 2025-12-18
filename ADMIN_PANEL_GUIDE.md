# MANSARA Admin Panel - Feature Overview

## Welcome to Your Admin Panel

The MANSARA Admin Panel gives you complete control over your e-commerce business without any technical knowledge required.

## Quick Access Links

- **Login Page**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Products**: `/admin/products`
- **Orders**: `/admin/orders`
- **Customers**: `/admin/customers`
- **Settings**: `/admin/settings`

## All Features at a Glance

### Dashboard
![Dashboard Icon] Quick overview of your business
- **Total Orders**: All orders ever placed
- **Today's Orders**: Orders received in the last 24 hours
- **Total Products**: All products in your catalog
- **Pending Orders**: Orders awaiting confirmation
- **Total Customers**: All customers who have purchased
- **Quick Actions**: Fast buttons to common tasks

### Products
![Products Icon] Manage your inventory
- **View All**: See all products in a table
- **Add Product**: Create new product listing
- **Edit Product**: Update product details
- **Delete Product**: Remove products
- **Toggle Status**: Quickly activate/deactivate
- **Search**: Find products by name
- **Filters**: Sort by category, status, flags

**Product Details You Can Set**:
- Name, description, ingredients
- Price and offer price
- Stock quantity
- Product images
- Visibility flags (Offer, New, Featured, Active)
- Weight/size specifications
- Storage instructions
- How to use guide

### Offers
![Offers Icon] Manage discounts and special offers
- **View Offers**: All products on special offer
- **Set Discounts**: Mark products as offers with special pricing
- **Calculate Savings**: Automatic discount percentage calculation
- **Display Savings**: Shows "You save ₹XXX" on storefront
- **Quick Edit**: Jump to product edit page

**How Offers Work**:
1. Go to Products → Edit a product
2. Check "Is Offer" box
3. Set offer price (lower than regular price)
4. Click Save
5. Product appears in /offers page automatically

### Combos
![Combos Icon] Create bundle deals
- **View Combos**: All combo offers
- **Create Combos**: Combine multiple products at special price
- **Show Savings**: Display how much customers save
- **Set Price**: Combo pricing separate from individual items
- **Activate/Deactivate**: Control which combos are visible

### Orders
![Orders Icon] Manage customer orders
- **View All Orders**: Complete order list
- **Order Details**: Customer info, items, amounts
- **Update Status**: Track order progress
- **Payment Status**: See payment confirmation status
- **Order Timeline**: Pending → Confirmed → Packed → Shipped → Delivered

**Order Status Workflow**:
```
Pending ─→ Confirmed ─→ Packed ─→ Shipped ─→ Delivered
(New order)  (Approved)  (Ready)   (In transit)  (Complete)
```

**How to Update Order Status**:
1. Go to Orders
2. Click "View" on an order
3. Select new status from dropdown
4. Status updates instantly
5. Customer can see status on their account

### Customers
![Customers Icon] View customer information (read-only)
- **Customer List**: All customers who have purchased
- **Customer Details**: Name, email, phone, address
- **Purchase History**: Total orders and total amount spent
- **Search**: Find customers quickly
- **No Direct Editing**: For data safety

**Customer Information Shown**:
- Name
- Email address
- Phone number
- Total number of orders
- Total amount spent
- Join date

### Content
![Content Icon] Edit website pages (CMS)
- **Homepage**: Edit home page content
- **About Page**: Manage About Us section
- **Why MANSARA**: Story and values content
- **Contact Page**: Contact information and form

**Easy Editor**:
- Plain text editing (no HTML knowledge needed)
- Save changes instantly
- See last update time
- Simple interface

### Banners
![Banners Icon] Promotional banners
- **Upload Banners**: Add promotional images
- **Select Location**: Choose where to display
- **Set Order**: Control display sequence
- **Auto Rotate**: Set up rotating banners
- **Enable/Disable**: Show or hide banners

### Settings
![Settings Icon] Configure your website
- **General Settings**:
  - Website name
  - Contact email
  - Phone number
  - Business address
- **Social Links**:
  - Facebook URL
  - Instagram URL
  - Twitter URL

## How Products Appear on Your Website

### Product Visibility Flags

Each product has visibility controls that determine where it shows:

| Flag | Where It Shows | Purpose |
|------|----------------|---------|
| **Is Active** | `/products` page | Main product catalog |
| **Is Offer** | `/offers` page | Special offers section |
| **Is New Arrival** | `/new-arrivals` page | New products section |
| **Is Featured** | Homepage | Homepage highlights |

**Examples**:
- Mark a product as "Is Offer" → It appears in `/offers` with special pricing
- Mark a product as "Is New Arrival" → It appears in `/new-arrivals` page
- Mark a product as "Is Featured" → It highlights on homepage
- Deactivate a product → It disappears from customer view (but stays in database)

## Workflow Examples

### Example 1: Create a New Product with Offer

1. Go to **Products** → Click **Add Product**
2. Enter product details:
   - Name: "Premium Ghee 500g"
   - Category: "Oil & Ghee"
   - Price: ₹500
   - Stock: 50
   - Image URL: [paste image link]
3. Set visibility flags:
   - Check "Is Offer"
   - Check "Is Featured"
4. Click **Save Product**
5. Product now appears in:
   - `/products` (main catalog)
   - `/offers` (special offers)
   - Homepage (featured section)

### Example 2: Process a New Order

1. Go to **Orders**
2. See a new order with status "pending"
3. Click **View** to see full details
4. Verify customer info and items
5. Update status to "confirmed"
6. When packed, update to "packed"
7. When shipped, update to "shipped"
8. When delivered, update to "delivered"
9. Customer can track progress on their account

### Example 3: Update Website Content

1. Go to **Content**
2. Click on "About" tab
3. Edit title and content
4. Make your changes
5. Click **Save Changes**
6. Changes appear on `/about` page immediately

### Example 4: Launch a Seasonal Campaign

1. Go to **Products**
2. Create/edit seasonal products
3. Mark best sellers as "Is Offer"
4. Create a **Combo** (e.g., "Winter Special Bundle")
5. Go to **Banners** → Add promotional banner
6. Go to **Settings** → Update email for orders
7. Announce on social (links from **Settings**)

## Key Concepts

### Admin Roles & Security
- Only users in admin_users table can access
- Password protected login with JWT
- Automatic session timeout for security
- One-click logout available anytime

### Data Management
- All data saved to Supabase database
- Automatic backups
- Easy to delete (with confirmation)
- Search & filter for easy finding
- Responsive on mobile devices

### Product Categories
- **Porridge Mixes**: Urad, Bajra, Ragi, Jowar, etc.
- **Oil & Ghee**: Ghee, Coconut, Sesame, Mustard, Neem

### Payment Statuses
- **Pending**: Payment not yet received
- **Paid**: Payment confirmed
- **Failed**: Payment failed

### Order Statuses
- **Pending**: Just received, not confirmed yet
- **Confirmed**: Customer accepted, ready to pack
- **Packed**: Items packed, ready to ship
- **Shipped**: Order sent to courier
- **Delivered**: Customer received
- **Cancelled**: Order cancelled

## Tips & Best Practices

### Product Management
✓ Use clear, descriptive product names
✓ Always add product images (helps customers)
✓ Keep descriptions informative but concise
✓ Set accurate stock quantities
✓ Use visibility flags strategically
✓ Review offers regularly to keep them fresh

### Order Management
✓ Update order status as soon as you ship
✓ Keep customer contact info accurate
✓ Process pending orders quickly
✓ Communicate shipping info to customers
✓ Mark delivered once confirmed

### Website Content
✓ Keep About page updated with current info
✓ Add customer testimonials
✓ Highlight your unique value proposition
✓ Keep contact info current
✓ Update content at least quarterly

### General
✓ Use strong password for admin account
✓ Log out when done, especially on shared computers
✓ Take regular backups of important data
✓ Test changes before going live
✓ Keep social media links updated

## Limitations & Future Features

### Current Limitations
- Direct image upload not available (use URLs instead)
- Bulk import/export not yet available
- No automated email notifications
- Analytics limited to basic counts

### Coming Soon
- Direct image uploads
- Bulk product import/export
- Automated order notifications
- Advanced analytics & reports
- Multiple admin user levels
- Activity logging
- Two-factor authentication

## Support

For help or questions:
1. Check **ADMIN_QUICKSTART.md** for common tasks
2. Review **README_ADMIN.md** for technical details
3. Check browser console (F12) for error messages
4. Verify database tables exist and have data

## Security Reminders

⚠️ **Important**:
- Never share your admin password
- Log out when done with admin panel
- Keep Supabase credentials secure
- Don't use simple/common passwords
- Enable 2FA if available in Supabase
- Regularly review admin user access

---

**You're all set!** Start managing your MANSARA Foods business with confidence.

Visit `/admin/login` to get started.
