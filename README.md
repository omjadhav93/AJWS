# AJ Water Solutions E-Commerce Platform

AJ Water Solutions is a full-featured E-Commerce platform designed for selling water filters and related products, with a robust multi-role system supporting sellers, buyers, and site administrators. The platform also offers after-sales services like repairs and plant bookings, making it a one-stop solution for water purification needs.

---

## 🚀 Features

- **Multi-Role System:**  
  - **User/Buyer:** Browse, search, and purchase water filters, manage cart, orders, addresses, and profile.
  - **Seller:** Add/manage products, view and process orders, manage brand presence.
  - **Admin/Handler:** Oversee site operations, manage users, brands, and handle support queries.

- **Authentication & Security:**  
  - Secure registration and login (password & OTP-based).
  - Session and JWT-based authentication.
  - Email verification and password reset via OTP.

- **Product Management:**  
  - Add, edit, and manage water filters and cabinets.
  - Product images, color variants, warranty, and detailed specs.
  - Brand and category management.

- **Order & Cart System:**  
  - Add to cart, place orders, track order status.
  - Order cancellation with reason tracking.
  - Buy Again and Favourites for quick reordering.

- **Service & Support:**  
  - Book plant installations.
  - Request repairs and maintenance.
  - Help/Support ticketing system.

- **Advanced Search & Filtering:**  
  - Fuzzy search for products, brands, and categories.
  - Sorting by price, popularity, and design.

- **Ratings & Reviews:**  
  - Multi-aspect product ratings (overall, design, quality, durability, value).
  - Customer feedback and testimonials.

- **Responsive UI:**  
  - Modern, mobile-friendly interface using Pug templates and custom CSS.
  - Role-based navigation and dashboards.

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Templating:** Pug (formerly Jade)
- **Authentication:** JWT, bcrypt, express-session, OTP (nodemailer)
- **File Uploads:** Multer
- **Email:** Nodemailer
- **Validation:** express-validator
- **Other:** dotenv, cookie-parser, node-cron, fuse.js (search), fs-extra

---

## 🧩 Complex Logic & Challenges

- **Multi-Role Routing & Views:**  
  Dynamic rendering and access control for sellers, users, and admins, with separate dashboards and permissions.

- **Product Model Number Generation:**  
  Unique model numbers generated using product type, brand, and randomization, ensuring no collisions.

- **Order ID Uniqueness:**  
  Custom logic to generate and verify unique order IDs, even under high concurrency.

- **Rating Aggregation:**  
  Automatic recalculation of product ratings on every review add/update/delete, using Mongoose hooks.

- **Session & JWT Hybrid Auth:**  
  Seamless session management for web navigation, with JWT for API endpoints.

- **Data Restoration:**  
  Support for restoring a full database (products, users, orders, etc.) from BSON backups for easy migration or demo setup.

- **Problems Faced:**  
  - Handling multi-role navigation and permissions without conflicts.
  - Ensuring atomicity and uniqueness in order and product creation.
  - Managing file uploads and static asset organization for product images.
  - Integrating OTP-based authentication and recovery flows.
  - Designing a scalable schema for extensible product types and ratings.

---

## 📦 Project Structure

```
Refresh/
  app.js                # Main server entry
  model/                # Mongoose models (User, Product, Order, etc.)
  router/               # Express route handlers (auth, product, cart, etc.)
  static/               # Static assets (CSS, JS, images)
  views/                # Pug templates for UI
  nodemailer/           # Email/OTP logic
  db-backup/            # BSON/JSON database backups for mongorestore
  package.json          # Dependencies and scripts
  .env                  # Environment variables (not committed)
```

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/aj-water-solutions.git
cd aj-water-solutions
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory. Here’s a sample structure:

```env
# MongoDB connection string (Atlas or localhost)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ajws?retryWrites=true&w=majority

# Session secret for express-session
SESSION_SECRET=your_session_secret

# JWT secret for authentication
JWT_SECRET_KEY=your_jwt_secret

# Email credentials for nodemailer (for OTP and notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Port
PORT=5500
```

> **Disclaimer:**
> Before using email features (OTP, notifications), make sure your Gmail or any email service is properly configured to work with Nodemailer. Refer to the [Nodemailer documentation](https://nodemailer.com/usage/) for required settings (such as enabling app passwords, allowing less secure apps, or OAuth2 setup) to avoid authentication errors.


### 4. Restore Sample Data

If you want to populate your database with sample data (products, users, etc.), use the provided BSON files in `db-backup/AJWS/`.

#### **Using mongorestore:**

**For MongoDB Atlas:**
```bash
mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.mongodb.net/ajws" --dir="db-backup/AJWS"
```

**For Localhost:**
```bash
mongorestore --db ajws --dir="db-backup/AJWS"
```

> Replace `<username>` and `<password>` with your MongoDB credentials.

### 5. Run the Project

```bash
node app.js
```

The app will be available at [http://localhost:5500](http://localhost:5500) (or your specified port).

---

## 📝 Additional Notes

- **Static Assets:**  
  Product images and other static files are served from the `/static` directory.

- **Admin/Seller Access:**  
  To access seller/admin features, register a user and set their `seller` field to `true` in the database.

- **Email/OTP:**  
  Ensure your email credentials are correct and allow less secure apps if using Gmail for development.

- **Environment Variables:**  
  Never commit your `.env` file or sensitive credentials to version control.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For any queries, support, or business inquiries, reach out via the email: [omkaraj420@gmail.com](mailto://omkaraj420@gmail.com)

---

**AJ Water Solutions**  
*Empowering Clean Water, One Filter at a Time.*

---