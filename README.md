# 🚀 Role-Based SaaS Billing Portal

A modern full-stack SaaS Billing Portal with secure authentication, role-based access control, subscription management, invoice tracking, and Stripe payment integration.

Built using React, Node.js, Express, PostgreSQL, and Tailwind CSS.

---

## 🌟 Features

✅ JWT Authentication  
✅ Role-Based Access Control (RBAC)  
✅ Admin Dashboard  
✅ Customer Dashboard  
✅ Billing & Subscription Management  
✅ Invoice History  
✅ Stripe Payment Integration  
✅ Team Management  
✅ Responsive Modern UI  
✅ Dark Mode Ready  
✅ Secure Backend APIs  

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Manage users, subscriptions, analytics |
| Billing Manager | Manage invoices and payments |
| Customer | View plans and billing history |

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- Stripe API

### Database
- PostgreSQL

### Deployment
- Vercel (Frontend)
- Render / Railway (Backend)

---

## 📂 Project Structure

```bash
Role-based-SaaS-billing-portal/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   └── services/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── config/
│
├── README.md
└── package.json
```

---

## 🔐 Authentication

This project uses:
- JWT-based authentication
- Protected routes
- Role-based authorization middleware

---

## 💳 Billing Features

- Subscription Plans
- Stripe Checkout
- Invoice Generation
- Payment History
- Billing Dashboard
- Upgrade/Downgrade Plans

Stripe provides hosted billing portal capabilities for subscriptions and invoices. :contentReference[oaicite:0]{index=0}

---

## 📊 Dashboard Features

- Revenue Analytics
- Active Subscriptions
- Invoice Statistics
- User Management
- Team Access Control

---

## 🎨 UI Features

- Modern SaaS Design
- Responsive Layout
- Dashboard Sidebar
- Glassmorphism Cards
- Mobile Friendly
- Smooth Navigation

Inspired by modern SaaS platforms like Stripe and Linear.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/cyril-p-jose/Role-based-SaaS-billing-portal.git
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

### Backend Setup

```bash
cd server
npm install
npm start
```

---

## 🔑 Environment Variables

Create `.env` file inside `server/`

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
STRIPE_SECRET=your_stripe_secret
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role VARCHAR(50)
);
```

---

## 🚀 Deployment

### Frontend

Deploy using:

- Vercel

### Backend

Deploy using:

- Render
- Railway

---

## 📸 Future Improvements

- AI Revenue Insights
- Usage-Based Billing
- Email Notifications
- Invoice PDF Download
- Multi-Tenant Workspaces
- Webhooks
- Audit Logs
- API Key Management

Modern SaaS billing systems increasingly support usage-based billing and analytics. :contentReference[oaicite:1]{index=1}

---

## 📚 Learning Outcomes

Through this project, I learned:

- Full-Stack Development
- Authentication & Authorization
- REST APIs
- PostgreSQL Integration
- Stripe Payments
- SaaS Architecture
- Git & GitHub Workflow
- Deployment

---

## 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

### Cyril P Jose

- GitHub: https://github.com/cyril-p-jose

---

## ⭐ Support

If you like this project:

⭐ Star the repository  
🍴 Fork the project  
📢 Share it with
::contentReference[oaicite:2]{index=2}
