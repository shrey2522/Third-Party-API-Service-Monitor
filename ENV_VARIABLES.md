# Environment Variables Checklist

## Backend (Render) Environment Variables

When deploying the backend to Render, you need to configure these environment variables in the Render dashboard:

### Required Variables

| Variable            | Example Value                                             | Description                                                    |
| ------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `NODE_ENV`          | `production`                                              | Sets the environment to production mode                        |
| `PORT`              | `5000`                                                    | Server port (Render auto-assigns, but specify for consistency) |
| `MONGODB_URI`       | `mongodb+srv://user:pass@cluster.mongodb.net/vendorvigil` | MongoDB Atlas connection string                                |
| `JWT_SECRET`        | `your-super-secret-jwt-key-here-change-this`              | Secret key for JWT token signing                               |
| `SMTP_HOST`         | `smtp.gmail.com`                                          | Email SMTP server host                                         |
| `SMTP_PORT`         | `587`                                                     | Email SMTP server port                                         |
| `SMTP_USER`         | `your-email@gmail.com`                                    | Email address for sending alerts                               |
| `SMTP_PASS`         | `your-app-password-here`                                  | Email app password (not your Gmail password)                   |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/XXX/YYY/ZZZ`            | Slack webhook URL for alerts                                   |
| `FRONTEND_URL`      | `https://your-app.vercel.app`                             | Your deployed frontend URL (for CORS)                          |

---

## Frontend (Vercel) Environment Variables

When deploying the frontend to Vercel, you need to configure these environment variables in the Vercel dashboard:

### Required Variables

| Variable       | Example Value                       | Description                                |
| -------------- | ----------------------------------- | ------------------------------------------ |
| `VITE_API_URL` | `https://your-backend.onrender.com` | Your deployed backend URL (without `/api`) |

---

## Local Development `.env` Files

### Backend `.env`

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendorvigil?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Slack Webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ

# JWT Configuration
JWT_SECRET=supersecretkey_change_this_production_12345

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## Security Notes

1. **Never commit `.env` files** to GitHub (already in `.gitignore`)
2. **Use strong JWT secrets** in production (generate with `crypto.randomBytes(32).toString('hex')`)
3. **Use Gmail App Passwords**, not your actual Gmail password
4. **Rotate secrets regularly**, especially if exposed
5. **Limit MongoDB Atlas IP whitelist** to specific IPs when possible (or use `0.0.0.0/0` for cloud deployments)

---

## How to Get These Values

### MongoDB URI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Slack Webhook URL

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create a new app or select existing
3. Enable "Incoming Webhooks"
4. Add webhook to workspace
5. Copy the Webhook URL

### JWT Secret (Generate Strong Secret)

```bash
# Run this locally to generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deployment Workflow

1. **Local Development**: Use `.env` files (already configured)
2. **Push to GitHub**: `.env` files are ignored (secure)
3. **Configure Hosting Platform**: Manually add environment variables in Render/Vercel dashboards
4. **Deploy**: Platforms use their configured variables (not from `.env` files)

---

**Note**: This checklist is for reference only. Your actual `.env` values should remain private and never be shared publicly.
