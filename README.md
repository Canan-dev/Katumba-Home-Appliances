# Katumba Home Appliances

A warm, minimalist, 100% responsive e-commerce website for **Katumba Home Appliances** (Uganda), built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP + ScrollTrigger**, **Lenis**, and **Firebase** (Authentication, Cloud Firestore, and Firebase Storage on the free Spark plan—so the database never pauses).

---

## Features

- **Warm Minimalist Brand Aesthetic**: Off-white/beige canvas (`#F7F4EF`), espresso typography (`#2C221E`), rounded walnut pill buttons (`#5C4332`), and **UGX** pricing across all products.
- **Smooth Scroll Animations (GSAP + Lenis)**:
  - **Sticky Hero Zoom & Swap**: Pins the hero section on scroll while keeping the left headline, description, and *Shop Now* button completely still, zooming in the main living room sofa photo and crossfading into a second wooden furniture showcase photo.
  - **Scroll Reveals & Parallax**: Category thumbnails and product cards fade upward sequentially (`once: true`), and the *Our Craftsmanship* wood joinery photo moves with subtle scroll-linked upward parallax.
- **Full-Screen Product View & WhatsApp Ordering**:
  - Clicking any product opens a full-screen modal with an interactive click-to-zoom photo inspector, material & dimension specs, a pre-filled **Order on WhatsApp** button (`https://wa.me`), and a **You May Also Like** section.
- **Password-Protected Owner Admin (`/admin`)**:
  - Backed by **Firebase Authentication (Email/Password)**, **Cloud Firestore**, and **Firebase Storage**. No hardcoded passwords in frontend code.

---

## Step-by-Step Setup Guide (Beginner-Friendly)

### 1. Create Your Free Firebase Project (Spark Plan)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Add project** (or select your existing `katumba-home-appliances` project) and follow the prompts. Keep the **Spark (No-cost)** plan.
3. In the left sidebar, click **Build → Authentication → Get started**:
   - Under **Sign-in method**, enable **Email/Password** and click **Save**.
   - Switch to the **Users** tab and click **Add user** to create your owner admin email & password.
4. In the left sidebar, click **Build → Firestore Database → Create database**:
   - Choose a region close to Uganda (e.g., `europe-west1` or `nam5`), start in **Production mode**, and click **Enable**.
   - Go to the **Rules** tab, paste the contents of [`firestore.rules`](./firestore.rules), and click **Publish**.
5. In the left sidebar, click **Build → Storage → Get started**:
   - Start in **Production mode**, choose the same region, and click **Done**.
   - Go to the **Rules** tab, paste the contents of [`storage.rules`](./storage.rules), and click **Publish**.

### 2. Paste Your Firebase Keys into `.env.local`

1. In Firebase Console, click the **Gear icon (Project Settings)** → **General** → scroll down to **Your apps** → click the `</>` (Web) icon to register a web app.
2. Copy the `firebaseConfig` values and paste them into a `.env.local` file in the root of this project (you can copy `.env.example` as a starting point):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=katumba-home-appliances.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=katumba-home-appliances
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=katumba-home-appliances.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Your WhatsApp Business number in international format without + (e.g., 256700000000)
NEXT_PUBLIC_WHATSAPP_NUMBER=256700000000
```

> **Note:** Make sure `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is `<your-project-id>.firebaseapp.com` (not `://firebaseapp.com`).

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, and [http://localhost:3000/admin](http://localhost:3000/admin) to log in with your Firebase owner account and upload products.

> **Tip:** Once logged into `/admin`, click **Import Sample Catalog** if you want to copy the initial sample furniture & appliances into your live Firestore database so you can edit or delete them right away.

### 4. Deploy to Vercel (Free Hosting)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), click **Add New Project**, and import your repository.
3. In **Environment Variables**, add all the `NEXT_PUBLIC_*` variables from your `.env.local` file.
4. Click **Deploy**. Your live Katumba Home Appliances store will be online in under 2 minutes!
