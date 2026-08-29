# InternHub — Full-Stack Internship Platform

A production-quality internship platform for students built with Next.js 16, TypeScript, PostgreSQL, Prisma, Razorpay, and multi-language support.

---

## Features

| Module | Features |
|---|---|
| **Auth** | Register, Login, Logout, Email OTP verification, Secure sessions (JWT) |
| **Password** | Forgot password (email or phone), letters-only password generator, daily reset limit |
| **Community** | Posts, photo/video upload, likes, comments, shares, reports, friend-based posting limits |
| **Friends** | Send/accept/reject/remove requests, friend count |
| **Internships** | Browse, search, filter, apply, application history, monthly limits |
| **Subscriptions** | Free/Bronze/Silver/Gold plans, Razorpay payments, payment window 10–11 AM IST |
| **Resume** | Multi-step form → OTP → Razorpay → PDF generation → profile attachment |
| **Languages** | English, Spanish, Hindi, Portuguese, Chinese, French (French requires OTP) |
| **Login Security** | Browser/OS/device/IP tracking, Chrome OTP requirement, mobile time restriction |
| **Admin** | User management, post moderation, internship management, subscriptions, login history |

---

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (server-side)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jose), argon2 password hashing
- **Payments**: Razorpay
- **Email**: Nodemailer/SMTP
- **File Storage**: Cloudinary
- **PDF**: Puppeteer (with HTML fallback)
- **Testing**: Jest + @swc/jest

---

## Requirements

- Node.js 18+
- PostgreSQL 14+
- npm 9+

---

## Installation

```bash
git clone <repo>
cd pramila
npm install
cp .env.example .env
# Edit .env with your credentials
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/internship_platform"
JWT_SECRET="your-secret-min-32-chars"

# Razorpay (required for payments)
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="your_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxx"

# Email / SMTP (required for OTPs and invoices)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@internhub.com"

# Cloudinary (required for photo/video uploads)
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## Database Setup

```bash
# 1. Create the database
createdb internship_platform

# 2. Run migrations
npx prisma migrate dev --name init

# 3. Generate Prisma client
npx prisma generate

# 4. Seed data (subscription plans, admin user, sample internships)
npm run db:seed
```

**Seeded credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@internshipplatform.com | AdminSecure2024 |
| Demo User | demo1@example.com | DemoUser2024 |
| Demo User | demo2@example.com | DemoUser2024 |

---

## Development

```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Production build
npm start          # Start production server
npm test           # Run tests
npm run lint       # ESLint
npm run db:seed    # Seed database
```

---

## API Endpoints

### Authentication
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/verify-otp | Verify OTP (any purpose) |
| POST | /api/auth/request-otp | Request OTP |
| POST | /api/auth/forgot-password | Forgot password |
| GET | /api/auth/generate-password | Generate letters-only password |
| GET | /api/auth/me | Get current user |

### Community
| Method | Path | Description |
|---|---|---|
| GET | /api/posts | List posts (paginated) |
| POST | /api/posts | Create post (friend-limit enforced) |
| DELETE | /api/posts/:id | Delete post |
| POST | /api/posts/:id/like | Like/unlike |
| POST | /api/posts/:id/comment | Add comment |
| DELETE | /api/posts/:id/comment | Delete comment |
| POST | /api/posts/:id/share | Share post |
| POST | /api/posts/:id/report | Report post |

### Friends
| Method | Path | Description |
|---|---|---|
| GET | /api/friends | List friends and requests |
| POST | /api/friends/request | Send friend request |
| POST | /api/friends/accept | Accept request |
| POST | /api/friends/reject | Reject request |
| DELETE | /api/friends/:id | Remove friend |

### Internships
| Method | Path | Description |
|---|---|---|
| GET | /api/internships | List/search/filter |
| GET | /api/internships/:id | Get detail |
| POST | /api/internships/:id/apply | Apply (subscription limit enforced) |
| GET | /api/internships/applications | My applications |

### Subscriptions
| Method | Path | Description |
|---|---|---|
| GET | /api/subscriptions/plans | All plans |
| GET | /api/subscriptions/current | My subscription |
| POST | /api/subscriptions/create-order | Create Razorpay order (payment window enforced) |
| POST | /api/subscriptions/verify-payment | Verify and activate |

### Resume
| Method | Path | Description |
|---|---|---|
| GET | /api/resume | My resumes |
| POST | /api/resume/request-otp | Send OTP before payment |
| POST | /api/resume/verify-otp | Verify OTP |
| POST | /api/resume/create-order | Create ₹50 order (OTP required) |
| POST | /api/resume/verify-payment | Verify and generate PDF |

### Language
| Method | Path | Description |
|---|---|---|
| POST | /api/language/request-verification | Request French OTP |
| POST | /api/language/verify | Verify French OTP |
| POST | /api/language/change | Change language (French OTP enforced server-side) |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | /api/admin/stats | Dashboard stats |
| GET/PATCH | /api/admin/users | User management |
| GET | /api/admin/posts | Post moderation |
| GET | /api/admin/internships | Internship management |
| GET | /api/admin/subscriptions | Subscription overview |
| GET | /api/admin/login-history | Login monitoring |

---

## Business Rules (Server-Side Enforced)

All rules are enforced server-side — they **cannot be bypassed** by calling APIs directly.

| Rule | Enforcement |
|---|---|
| 0 friends → cannot post | `canCreatePost()` checks DB friend count |
| 1 friend → 1 post/day | Daily counter per IST day |
| 2 friends → 2 posts/day | Scales with friend count up to 10 |
| >10 friends → unlimited | Limit = -1 |
| Free plan → 1 application/month | `canApplyForInternship()` |
| Payment only 10–11 AM IST | `checkPaymentWindow()` uses server time |
| Mobile login only 10 AM–1 PM IST | `checkMobileLoginTime()` |
| Chrome login requires OTP | `requiresChromeOtp()` — session only created after OTP |
| French language requires OTP | `requiresFrenchVerification()` — change blocked without verification |
| Password reset once per day | `canRequestPasswordReset()` — enforced in DB |
| Resume requires OTP before payment | `canGenerateResume()` — checks recent OTP verification |
| Resume payment requires OTP | Payment order creation blocked without prior OTP |

---

## Razorpay Configuration

1. Create account at [razorpay.com](https://razorpay.com)
2. Get test API keys from Dashboard → Settings → API Keys
3. Set in `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=your_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
   ```
4. Payment window enforced: **10:00 AM – 11:00 AM IST**

---

## Email Configuration (Gmail Example)

1. Enable 2FA on Gmail account
2. Create App Password: Google Account → Security → App Passwords
3. Set in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```
4. In development (no SMTP configured), OTPs and emails are logged to console.

---

## File Storage (Cloudinary)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Set in `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

---

## Testing

```bash
npm test                    # Run all tests
npx jest --verbose          # Verbose output
```

**Test coverage includes:**
- Payment window (09:59, 10:00, 10:59, 11:00, 11:01 IST edge cases)
- Mobile login window (09:59, 10:00, 12:59, 13:00, 13:01 IST)
- Password generator (letters-only, no numbers, no symbols, entropy)
- Chrome OTP detection (Chrome vs Firefox vs Edge vs Opera vs Safari)
- Mobile device detection (Android, iPhone vs Windows desktop, Mac)
- IST day boundary calculations

---

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
# Set all environment variables in Vercel Dashboard → Settings → Environment Variables
```

### Docker
```bash
docker build -t internhub .
docker run -p 3000:3000 --env-file .env internhub
```

### VPS / Node.js
```bash
npm run build
npm start       # Runs on port 3000
```

---

## Security Notes

- Passwords hashed with argon2id (memory-hard)
- JWT sessions (7-day expiry, HttpOnly cookies)
- Server-side rate limiting on all sensitive endpoints
- All business rules enforced server-side (no client-bypass possible)
- Payment signature verified server-side (Razorpay HMAC-SHA256)
- OTPs: SHA-256 hashed, 10-minute expiry, 5-attempt limit
- File uploads: MIME type validation, size limits, Cloudinary storage

---

## Required Configuration Summary

| Service | Required For | Environment Variables |
|---|---|---|
| PostgreSQL | Everything | `DATABASE_URL` |
| Razorpay | Subscription & Resume payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| SMTP/Gmail | OTPs, invoices, password reset | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` |
| Cloudinary | Photo/video uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| puppeteer | PDF generation (optional) | install `puppeteer` package; falls back to HTML if unavailable |
