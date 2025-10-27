This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Royal Gems Institute – Admin Panel

This admin panel is built with Next.js App Router, Tailwind, and shadcn/ui, following OWASP practices.

## Security Features

- Authentication with bcrypt (cost factor 12)
- Strong password policy: min 12 chars, uppercase, lowercase, number, special char
- 2FA (TOTP via Google Authenticator), secrets stored only as base32
- RBAC: SuperAdmin, Admin, Moderator enforced by middleware and API
- All /admin routes protected in `middleware.ts` with JWT verification and role checks
- JWT access (15m) + refresh (7d) with refresh rotation endpoint
- Cookies: HttpOnly, Secure, SameSite=Strict
- CSRF protection for all mutating requests via `x-csrf-token` header matched to cookie
- Session idle timeout (default 30m) with sliding refresh in middleware
- Re-authentication required for sensitive actions (delete user, role change) via `/api/auth/reauth`
- Audit logging of admin actions (login/logout, user/product/order changes) with timestamp, admin id/email, IP, and UA
- Input validation/sanitization helpers; safe file uploads with type/size checks and random filenames stored outside webroot

## Admin Pages

- /admin/login – email/password with 2FA
- /admin – dashboard overview
- /admin/users – user management (search, create, suspend/activate, change role, delete)
- /admin/gems – manage gem listings (add/edit/delete/approve)
- /admin/orders – view/track/refund/cancel orders
- /admin/logs – audit log viewer
- /admin/settings – security/role config (SuperAdmin)

## API Routes

- POST /api/auth/login, POST /api/auth/logout, POST /api/auth/refresh
- POST /api/auth/forgot-password (disabled)
- POST /api/auth/reauth (short-lived cookie for sensitive actions)
- 2FA: POST/PUT/DELETE /api/auth/2fa
- Admin:
	- /api/admin/users (GET/POST/PUT/DELETE)
	- /api/admin/gems (GET/POST/PUT/DELETE)
	- /api/admin/orders (GET/PUT)
	- /api/admin/logs (GET)
	- /api/admin/stats (GET)
	- /api/admin/upload (POST)

## Environment

See `.env.local` for required variables (MongoDB, JWT secrets, email SMTP, upload directory, etc.).

## Development

1. Install deps
2. Ensure MongoDB is running and `.env.local` is set
3. Run the dev server

## Notes

- Replace SMTP credentials with secure app passwords.
- For production, use a dedicated storage bucket (S3, etc.) instead of local uploads.
- Consider Redis for rate limiting and session tracking.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
