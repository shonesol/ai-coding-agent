# Unrestricted AI Web Application

A full-stack AI chat application with:

- User authentication (Firebase Auth)
- Persistent chat history (Firestore)
- Completely open / unrestricted system prompt
- Stripe subscriptions (Free / Pro / Unlimited)
- Image upload + analysis (Cloudinary)
- Secure backend via Firebase Cloud Functions
- Ready for GitHub + Firebase Hosting

> **Important**: This app uses a maximally open system prompt. You are responsible for legal compliance, terms of service, and content policies in your jurisdiction. Stripe and payment processors may still restrict certain uses.

---

## Features

- Sign up / Login
- Chat with full history per user
- Image uploads via Cloudinary
- Stripe Checkout + Customer Portal
- Webhook-synced subscription status
- Free tier message limits
- Dark modern UI

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd unrestricted-ai-app
npm install
```

### 2. Environment Variables

Copy `.env.example` → `.env` and fill in the values:

```bash
cp .env.example .env
```

Required:
- Firebase config
- Stripe publishable key + Price IDs
- Cloudinary cloud name + unsigned upload preset
- LLM API key + base URL (OpenAI-compatible)

### 3. Firebase Setup

1. Create a Firebase project
2. Enable **Authentication** → Email/Password
3. Create a **Firestore** database
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Install Firebase CLI and login:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use <your-project-id>
   ```

### 4. Stripe Setup (Complete)

1. Create a Stripe account (test mode first)
2. Create two Products + Prices:
   - Pro → $19/month → copy Price ID
   - Unlimited → $49/month → copy Price ID
3. Put the Price IDs in `.env`
4. Put your **Publishable key** in `.env`
5. For Cloud Functions, set the secret key:
   ```bash
   firebase functions:config:set stripe.secret_key="sk_test_..."
   firebase functions:config:set stripe.webhook_secret="whsec_..."
   ```

### 5. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 6. Stripe Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

```
https://<region>-<project-id>.cloudfunctions.net/stripeWebhook
```

Events to select:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Copy the signing secret → set it with `firebase functions:config:set stripe.webhook_secret=...`

### 7. Cloudinary

1. Create account
2. Settings → Upload → Add **unsigned** upload preset
3. Put cloud name + preset name in `.env`

### 8. Run locally

```bash
npm run dev
```

### 9. Deploy frontend

```bash
npm run build
firebase deploy --only hosting
```

Or push to GitHub and connect to Vercel / Netlify / Firebase Hosting.

---

## Project Structure

```
unrestricted-ai-app/
├── functions/               # Stripe + secure LLM proxy
│   ├── index.js             # createCheckoutSession, createPortalSession, stripeWebhook, createCompletion
│   └── package.json
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx
│   │   ├── Chat.jsx
│   │   ├── Message.jsx
│   │   ├── Pricing.jsx
│   │   └── Sidebar.jsx
│   ├── ai.js                # Open system prompt + LLM client
│   ├── firebase.js          # Auth, Firestore, callable functions
│   ├── stripe.js            # Checkout + Portal helpers
│   ├── App.jsx
│   └── main.jsx
├── firestore.rules          # User data isolation
├── firebase.json
├── .env.example
└── README.md
```

---

## Security Notes

- Firestore rules ensure users can only access their own chats and profile.
- Stripe secret key and LLM API key live **only** in Cloud Functions.
- Frontend only has the Stripe publishable key.
- Always use HTTPS in production.
- Add rate limiting / abuse detection before going public with an unrestricted model.

---

## Customizing the AI

Edit the `SYSTEM_PROMPT` in:
- `src/ai.js` (client-side version)
- `functions/index.js` → `createCompletion` (recommended secure version)

You can switch providers by changing `VITE_LLM_BASE_URL` and `VITE_LLM_MODEL` (or the corresponding functions config).

---

## License

MIT — use at your own risk.

---

## Extra: Docker & Deployment Scripts

### Docker
```bash
# Build and run locally
docker build -t unrestricted-ai .
docker run -p 3000:80 unrestricted-ai

# Or with docker-compose
docker-compose up --build
```

### One-command deploy
```bash
./deploy.sh
```
(Requires `firebase login` and `firebase use <project>` already done.)

---

## Extra: EmailJS Welcome Email

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Add an email service (Gmail works fine)
3. Create a template with variables: `{{to_name}}`, `{{to_email}}`, `{{plan}}`, `{{message}}`
4. Add to `.env`:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

A welcome email is automatically sent on every new sign-up.

---

## Security headers (Docker / nginx)

The included `nginx.conf` already adds:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Gzip compression
- Proper SPA routing
