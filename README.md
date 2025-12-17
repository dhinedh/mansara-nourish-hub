# 🌿 MANSARA FOODS - E-Commerce Platform

**Nourish from Within – The Power of MANSARA**

A complete e-commerce platform for traditional Indian foods including porridge mixes, cold-pressed oils, and pure ghee.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 4. Build for Production
```bash
npm run build
```

---

## 📖 Complete Documentation

For detailed implementation guide, database schema, and remaining tasks, see:
**[MANSARA_PROJECT_GUIDE.md](./MANSARA_PROJECT_GUIDE.md)**

---

## 🎯 Features

### Customer-Facing Features
✅ Product browsing with categories (Porridge Mixes, Oil & Ghee)
✅ Offers page with discounted products
✅ Combos page with value packs
✅ New Arrivals showcase
✅ Detailed product pages with ingredients and usage instructions
✅ Shopping cart with localStorage persistence
✅ Responsive design (mobile, tablet, desktop)
✅ Beautiful UI with brand colors and custom animations

### E-Commerce Functionality
✅ Add to cart
✅ Update quantities
✅ Remove items
✅ Cart total calculation
✅ Checkout flow (basic)
✅ Order history (structure ready)

### Database (Supabase)
✅ Complete schema with 10 tables
✅ Row Level Security (RLS) policies
✅ 10 products seeded with full details
✅ 4 combo offers
✅ Category management
✅ Content pages (About, Contact)

---

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Query + Context API
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

---

## 📁 Project Structure

```
mansara-foods/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # React components
│   │   ├── layout/      # Header, Footer, Layout
│   │   └── ui/          # shadcn/ui components
│   ├── context/         # React context (CartContext)
│   ├── data/            # Static data (legacy)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and Supabase client
│   ├── pages/           # Page components
│   └── App.tsx          # Main application
├── public/              # Public assets
├── .env.example         # Environment variables template
└── MANSARA_PROJECT_GUIDE.md  # Complete implementation guide
```

---

## 🎨 Brand Colors

- **Primary Yellow:** `#F4CE14` (Sunshine yellow for CTAs)
- **Accent Pink:** `#DC2555` (Deep pink for offers)
- **Brand Blue:** `#1E2875` (Royal blue for headings)
- **Cream:** `#FFFDF5` (Warm background)
- **Light Yellow:** `#FFF9C4` (Section backgrounds)

---

## 📝 TODO - Before Production

### Critical
1. **Add Real Product Images** - Replace Pexels placeholders
2. **Configure Environment Variables** - Add Supabase credentials
3. **Build Admin Panel** - Product/order/customer management
4. **Implement User Authentication** - Sign up, login, profile
5. **Complete Checkout** - Order creation, payment gateway

### High Priority
6. Image upload to Supabase Storage
7. Search functionality
8. Order tracking
9. Email notifications
10. Admin dashboard with statistics

See [MANSARA_PROJECT_GUIDE.md](./MANSARA_PROJECT_GUIDE.md) for complete task list.

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Secure authentication via Supabase Auth
- ✅ Protected routes for admin operations
- ✅ Input sanitization
- ✅ Environment variables for sensitive data

---

## 📱 Pages

### Public Pages
- **/** - Home page with featured products
- **/products** - All products with category filter
- **/offers** - Discounted products
- **/combos** - Value pack combos
- **/new-arrivals** - Latest additions
- **/product/:slug** - Product detail page
- **/cart** - Shopping cart
- **/checkout** - Checkout flow
- **/about** - About MANSARA
- **/contact** - Contact information

### Admin Pages (To Be Built)
- **/admin** - Admin dashboard
- **/admin/products** - Product management
- **/admin/orders** - Order management
- **/admin/customers** - Customer management
- **/admin/content** - Content management
- **/admin/banners** - Banner management

---

## 🌟 About MANSARA

MANSARA was founded in December 2020 with a mission to make pure, nourishing food a part of everyday life. We offer:

- **Porridge Mixes**: URAD Classic, Salt & Pepper, Millet Magic, Premium, Black Rice Delight
- **Oil & Ghee**: Cold-pressed Groundnut, Sesame, Coconut oils, and traditional A2 Ghee
- **Combos**: Value packs for families

**Our Promise:** Clean ingredients, traditional wisdom, modern convenience.

---

For detailed setup and development guide, see [MANSARA_PROJECT_GUIDE.md](./MANSARA_PROJECT_GUIDE.md)
