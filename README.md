# Royal Gems InstituteThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern e-commerce platform for gemstone products built with Next.js 15, Supabase, and PayHere payment gateway.## Getting Started



## 🚀 Getting StartedFirst, run the development server:



### Prerequisites```bash

- Node.js 18+ npm run dev

- npm or yarn# or

- Supabase accountyarn dev

- PayHere merchant account (for payments)# or

pnpm dev

### Installation# or

bun dev

1. **Clone the repository**```

```bash

git clone <repository-url>Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

cd royal-gems-institute

```## Royal Gems Institute – Admin Panel



2. **Install dependencies**This admin panel is built with Next.js App Router, Tailwind, and shadcn/ui, following OWASP practices.

```bash

npm install## Security Features

```

- Authentication with bcrypt (cost factor 12)

3. **Set up environment variables**- Strong password policy: min 12 chars, uppercase, lowercase, number, special char

Create a `.env.local` file with the following:- 2FA (TOTP via Google Authenticator), secrets stored only as base32

```env- RBAC: SuperAdmin, Admin, Moderator enforced by middleware and API

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url- All /admin routes protected in `middleware.ts` with JWT verification and role checks

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key- JWT access (15m) + refresh (7d) with refresh rotation endpoint

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key- Cookies: HttpOnly, Secure, SameSite=Strict

- CSRF protection for all mutating requests via `x-csrf-token` header matched to cookie

PAYHERE_MERCHANT_ID=your_merchant_id- Session idle timeout (default 30m) with sliding refresh in middleware

PAYHERE_MERCHANT_SECRET=your_merchant_secret- Re-authentication required for sensitive actions (delete user, role change) via `/api/auth/reauth`

NEXT_PUBLIC_BASE_URL=http://localhost:3000- Audit logging of admin actions (login/logout, user/product/order changes) with timestamp, admin id/email, IP, and UA

FRONTEND_URL=http://localhost:3000- Input validation/sanitization helpers; safe file uploads with type/size checks and random filenames stored outside webroot

NODE_ENV=development

IS_SANDBOX=true## Admin Pages

```

- /admin/login – email/password with 2FA

4. **Set up Supabase**- /admin – dashboard overview

- Run the migrations in `supabase/migrations/` folder- /admin/users – user management (search, create, suspend/activate, change role, delete)

- Configure storage buckets (see `scripts/setup-storage.ts`)- /admin/gems – manage gem listings (add/edit/delete/approve)

- Set up authentication providers- /admin/orders – view/track/refund/cancel orders

- /admin/logs – audit log viewer

5. **Run the development server**- /admin/settings – security/role config (SuperAdmin)

```bash

npm run dev## API Routes

```

- POST /api/auth/login, POST /api/auth/logout, POST /api/auth/refresh

Open [http://localhost:3000](http://localhost:3000) in your browser.- POST /api/auth/forgot-password (disabled)

- POST /api/auth/reauth (short-lived cookie for sensitive actions)

## 📁 Project Structure- 2FA: POST/PUT/DELETE /api/auth/2fa

- Admin:

```	- /api/admin/users (GET/POST/PUT/DELETE)

├── app/                    # Next.js 15 App Router pages	- /api/admin/gems (GET/POST/PUT/DELETE)

│   ├── admin/             # Admin panel pages	- /api/admin/orders (GET/PUT)

│   ├── api/               # API routes	- /api/admin/logs (GET)

│   └── ...                # Public pages	- /api/admin/stats (GET)

├── components/            # React components	- /api/admin/upload (POST)

├── lib/                   # Core business logic

│   ├── auth/             # Authentication services## Environment

│   ├── repositories/     # Data access layer

│   └── ...See `.env.local` for required variables (MongoDB, JWT secrets, email SMTP, upload directory, etc.).

├── supabase/             # Database migrations

├── scripts/              # Utility scripts## Development

├── docs/                 # Documentation files

└── types/                # TypeScript type definitions1. Install deps

```2. Ensure MongoDB is running and `.env.local` is set

3. Run the dev server

## 🔐 Security Features

## Notes

- **Authentication**: Supabase Auth with SSR support

- **Authorization**: Role-based access control (SuperAdmin, Admin, Moderator)- Replace SMTP credentials with secure app passwords.

- **Storage**: Supabase Storage with service role for admin uploads- For production, use a dedicated storage bucket (S3, etc.) instead of local uploads.

- **Payments**: PayHere integration with webhook validation- Consider Redis for rate limiting and session tracking.

- **CSRF Protection**: Token-based CSRF validation

- **Session Management**: Cookie-based sessions with timeoutYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



## 🛠️ Admin PanelThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



Access the admin panel at `/admin/login`## Learn More



**Features:**To learn more about Next.js, take a look at the following resources:

- Dashboard with statistics

- User management- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Gem product management with image upload- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- Order tracking and management

- Audit logsYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- Settings configuration

## Deploy on Vercel

## 💳 Payment Integration

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Uses PayHere payment gateway for secure transactions:

- Sandbox mode for testingCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- Production mode for live payments
- Webhook support for payment verification
- Order status tracking

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🗄️ Database Scripts

- `npx tsx scripts/setup-storage.ts` - Set up Supabase storage buckets
- `npx tsx scripts/seed-database.ts` - Seed database with sample data
- `npx tsx scripts/create-admin.js` - Create admin user

## 📚 Documentation

Additional documentation can be found in the `/docs` folder:
- Setup guides
- Migration documentation
- Testing guides
- Quick start reference

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set with production values:
- Use production Supabase credentials
- Set `NODE_ENV=production`
- Set `IS_SANDBOX=false` for live payments
- Update `NEXT_PUBLIC_BASE_URL` and `FRONTEND_URL`

## 🧪 Testing

```bash
npm test
```

## 📄 License

All rights reserved.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.
