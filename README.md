# Singodhia Foods — Desi Homemade Pickles E-commerce Platform
*(स्वाद घर जैसा, परंपरा राजस्थान की)*

![Singodhia Foods Logo](client/public/logo.svg)

A complete, modern, premium, mobile-responsive e-commerce platform built for **Singodhia Foods**, an authentic Indian homemade pickle brand rooted in 40 years of Rajasthani culinary heritage.

Inspired by traditional D2C food brands (like FarmDidi), the website reflects an earthy, traditional, artisanal aesthetic: warm cream and off-white backgrounds, deep brand green, golden mustard yellow accents, terracotta chili red callouts, and glazed ceramic martaban (barni) imagery.

---

## 🌟 Key Features

### 🛒 1. Customer Storefront
- **Top Promotional Announcement Bar:** Rotating promotional alerts, free shipping progress cues, and coupon code highlights (`DESI10`, `SWAD15`).
- **Responsive Header & Navigation:** Custom brand SVG logo, category dropdowns, live search modal, wishlist counter, cart counter badge, and customer account status.
- **Hero Banner:** Evocative traditional Rajasthani messaging, handcrafted imagery, trust badges, and quick CTA buttons.
- **Trust Badges (Authentic & Verified):**
  - ☀️ *100% Sun-Cured in Ceramic Barnis (Martabans)*
  - 🌿 *Pure Cold-Pressed Kachi Ghani Mustard Oil*
  - 👵 *Grandmother's 40-Year Family Recipes*
  - 🚫 *Zero Chemical Preservatives or Synthetic Vinegars*
  - 📦 *Leak-Proof Spill-Resistant Food Grade Packing*
- **Best-Selling Pickles Section:** Dynamic filtering tabs (All, Mango, Banarasi Lal Mirch, Kair Sangri, Combos), interactive jar weight selectors, and quick-add actions.
- **Shop by Category:** Visual grid of Indian pickle specialties (Mango, Red Chilli, Green Chilli, Lemon, Garlic, Mixed, Rajasthani Specials, Combos).
- **Our Homemade Promise Section:** Narrative story explaining sun-curing in glazed martabans under Rajasthan sunlight.
- **Featured Combo Packs & Hampers:** Curated gift hampers including *Dadi's Special Trial Box (5 Mini Barni Jars)* and *Rajasthani Shahi Martaban Hamper (Ceramic Barnis + Brass Spoon)*.
- **"Build Your Own Pickle Combo" Tool (`/build-combo`):** Interactive custom box builder where customers choose box size (3 or 4 jars) and pick their favorite pickles into visual slots with bundle discounts.
- **Why Choose Singodhia Foods:** 6 detailed brand standard pillars.
- **How to Enjoy Our Pickles:** Authentic Indian meal pairing guides (Crispy Parathas, Dal-Chawal, Khichdi, Dal Baati).
- **Customer Reviews & Testimonials:** Genuine buyer experiences with star ratings and regional locations (Jaipur, Delhi, Gurugram, Bengaluru).
- **Welcome Offers & Newsletter:** 10% instant discount voucher coupon form.
- **Frequently Asked Questions (FAQ Accordion):** Expandable answers covering preparation, shelf life, shipping, and COD.
- **Authentic Footer:** Contact details in Jaipur, Rajasthan, WhatsApp chat button, quick links, and payment method icons.

### 🛍️ 2. Product Catalog & Details
- **Product Catalog (`/shop`):**
  - Filter by Categories (Mango, Red Chilli, Green Chilli, Lemon, Rajasthani Specials, Garlic, Mixed, Combos)
  - Filter by Spice Levels (*Mild*, *Medium*, *Spicy*, *Extra Spicy / Teekha*)
  - Sort by Price (Low to High, High to Low), Customer Rating, Popularity, and New Arrivals
  - Live instant search modal across all pickle ingredients and names
- **Product Detail Page (`/product/:slug`):**
  - High-resolution image gallery with thumbnail switcher
  - Dynamic weight variant selector (e.g., 200g, 250g, 350g, 500g, 1kg) updating prices instantly
  - Flame-based spice level meter and oil type indicator
  - Quantity controls, "Add to Cart", "Buy Now", and Wishlist toggle
  - Story & Taste Profile tab
  - Full ingredient list with zero chemical adulteration guarantee
  - Grandmother's storage instructions and 12-24 month shelf-life info
  - Customer review submission form and verified reviews
  - Related product recommendations

### 💳 3. Cart, Checkout & Payments
- **Slide-out Cart Drawer & Full Cart Page (`/cart`):**
  - Dynamic **Free Shipping Progress Bar** ("Add ₹X more to unlock FREE Delivery!")
  - Quantity adjustments, variant details, and item deletion
  - Verified coupon code applicator (`DESI10`, `SWAD15`, `FREESHIP`)
  - Subtotal, discounts, shipping fees, and final payable amount
  - Persistent cart saved across browser sessions via `localStorage`
- **Checkout Page (`/checkout`):**
  - Customer contact details collection
  - Indian PIN code validation and State selector
  - Cash on Delivery (COD) support with doorstep UPI / cash note
  - Official Razorpay SDK payment integration (UPI, GPay, PhonePe, Cards, Net Banking)
  - Backend payment signature verification (`sha256` HMAC)
- **Order Confirmation Page (`/order-confirmation/:orderNumber`):**
  - Generates official order tracking number (e.g. `SGF-261009-8421`)
  - Itemized receipt breakdown and estimated delivery date

### 👤 4. Customer Accounts
- User Registration (`/register`) and Secure Login (`/login`)
- Profile details management
- Saved delivery addresses management (Add, default, delete)
- Order history with status tags (*Placed*, *Processing*, *Shipped*, *Delivered*)
- Wishlist collection

### 🛡️ 5. Protected Admin Dashboard (`/admin`)
- **Dashboard Overview:** Real-time metrics for total revenue, orders, products, customers, and recent order feeds.
- **Product Management (`/admin/products`):** Create, edit, delete pickles, manage weight variants, stock counts, spice meters, and bestseller flags.
- **Order Management (`/admin/orders`):** Update order lifecycle (*Placed* → *Processing* → *Shipped* → *Delivered*), assign courier tracking IDs and courier partners.
- **Category Management (`/admin/categories`):** Add and manage pickle varieties.
- **Coupon Management (`/admin/coupons`):** Create discount codes with percentage/fixed discounts, min order amounts, and validity.
- **Review Moderation (`/admin/reviews`):** Approve, feature, or delete customer reviews.
- **Store Settings (`/admin/settings`):** Dynamic free shipping threshold, COD toggle, announcement marquee text, and WhatsApp support number.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Lucide React, Axios, React Context API |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, JWT (JSON Web Tokens), bcryptjs |
| **Database** | MongoDB Atlas / Local MongoDB (with resilient in-memory fallback) |
| **Payment Gateway** | Razorpay SDK with backend signature verification |
| **File Uploads** | Multer with file type & size validation |

---

## 📂 Project Structure

```
singodhia-foods/
├── client/
│   ├── public/
│   │   ├── logo.svg
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, AnnouncementBar, TrustBadges, WhatsAppButton, SpiceMeter, StarRating, CartDrawer, SearchModal
│   │   │   ├── home/           # HeroBanner, BestSellersSection, CategorySection, HomemadePromiseSection, ComboHampersSection, WhyChooseSection, HowToEnjoySection, CustomerReviewsSection, OffersAndNewsletter, FaqSection
│   │   │   └── product/        # ProductCard, QuickViewModal
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── BuildComboPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── admin/          # AdminDashboard, AdminProducts, AdminOrders, AdminCategories, AdminCoupons, AdminReviews, AdminSettings
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── services/
│   │   │   └── api.js          # Unified API layer with graceful fallbacks
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   └── sampleData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB connection with graceful resilience
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── couponController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT & Admin role verification
│   │   ├── upload.js           # Multer configuration
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   ├── Review.js
│   │   └── Setting.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── seedData.js         # Authentic Rajasthani pickle catalog seeder
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Optional: MongoDB Atlas cluster URI or local MongoDB daemon

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```

2. Configure your environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/singodhia_foods?retryWrites=true&w=majority
   JWT_SECRET=singodhia_super_secret_jwt_key_2026_rajasthan
   ADMIN_EMAIL=admin@singodhiafoods.com
   ADMIN_PASSWORD=Admin@Singodhia2026
   RAZORPAY_KEY_ID=rzp_test_placeholder_key
   RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
   ```

3. (Optional) Seed the database with authentic Rajasthani pickle data:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

---

### 2. Frontend Setup

1. In a separate terminal, navigate to the `client` directory:
   ```bash
   cd client
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

---

## 🔑 Default Accounts (Demo & Testing)

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@singodhiafoods.com` | `Admin@Singodhia2026` | Full Admin Dashboard (`/admin`), Product Editing, Order Management |
| **Customer** | `customer@example.com` | `Password123` | Storefront browsing, Cart, Checkout, Order History |

---

## 💳 Razorpay Online Payment Setup

To enable live or test payments with Razorpay:
1. Sign up at [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/).
2. Navigate to **Settings** → **API Keys** and generate **Key ID** and **Key Secret**.
3. Place `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `server/.env`.
4. When testing in development, Cash on Delivery (COD) is enabled by default and places orders immediately without requiring payment gateway credentials.

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Build the frontend for production:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `client/dist` directory. Set `VITE_API_URL` to your production backend URL.

### Backend (Render / Railway / AWS EC2)
1. Set the environment variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) in your hosting dashboard.
2. Start the server using:
   ```bash
   npm start
   ```

---

## 📜 License
Crafted for **Singodhia Foods** — Desi Homemade Pickles. Handcrafted in Rajasthan, India. All rights reserved.

