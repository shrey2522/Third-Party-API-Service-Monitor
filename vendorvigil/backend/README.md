# VendorVigil Backend

Automated API health monitoring system built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file and set your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/vendorvigil
# OR use MongoDB Atlas
```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── models/          # MongoDB schemas (Vendor, Log, Incident)
├── services/        # Business logic (pingerService)
├── utils/           # Helper utilities (cronScheduler)
├── routes/          # API routes (coming in Phase 4)
├── controllers/     # Route controllers (coming in Phase 4)
├── server.js        # Express app entry point
└── .env             # Environment variables
```

## 🔧 Current Features

✅ MongoDB connection with error handling  
✅ Vendor model with user-defined timeouts and check frequencies  
✅ Log model with time-series optimization  
✅ Incident tracking for service outages  
✅ Background monitoring service (pingerService)  
✅ Cron scheduler (runs every 5 minutes)  
✅ Consecutive failure detection (alerts after 3 failures)  

## 📝 Next Steps

- [ ] Add API routes for vendor CRUD operations
- [ ] Implement alert service (Email/Slack)
- [ ] Build React frontend dashboard
- [ ] Add authentication

## 🧪 Testing

To test the monitoring engine, you can manually add a vendor to MongoDB:

```javascript
// Using MongoDB Compass or mongosh
db.vendors.insertOne({
  name: "Google",
  url: "https://www.google.com",
  checkFrequency: 5,
  timeoutDuration: 4,
  latencyThreshold: 500,
  alertThreshold: 3,
  isActive: true
})
```

Watch the console logs to see the monitoring in action!
