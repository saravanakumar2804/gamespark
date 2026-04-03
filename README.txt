═══════════════════════════════════════════════════════════════
  GAMESPARK — COMPLETE DEPLOYMENT GUIDE
  Read every step carefully. Takes about 30-45 minutes total.
═══════════════════════════════════════════════════════════════

WHAT YOU HAVE:
  /backend  → Node.js + Express API server
  /frontend → React website with 1500+ games via GamePix

─────────────────────────────────────────────────────────────
STEP 1 — SET UP MONGODB ATLAS (your database)
─────────────────────────────────────────────────────────────
You already have a MongoDB Atlas account. Do this:

1. Login at: mongodb.com/cloud/atlas
2. Click your cluster → Connect → Connect your application
3. Copy the connection string. It looks like:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
4. Open: backend/.env
5. Replace the MONGODB_URI line with your connection string
   Add "gamespark" at the end:
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xxx.mongodb.net/gamespark
6. Also set your admin email and password in .env

─────────────────────────────────────────────────────────────
STEP 2 — DEPLOY BACKEND TO RENDER.COM (free)
─────────────────────────────────────────────────────────────
1. Go to: render.com → Sign up with Google
2. Click "New" → "Web Service"
3. Choose "Deploy from Git" OR "Upload files"
   (Easiest: Upload → drag your /backend folder)
4. Settings:
   - Name: gamespark-api
   - Runtime: Node
   - Build command: npm install
   - Start command: node server.js
5. Add Environment Variables (click "Environment"):
   MONGODB_URI = (your MongoDB URL)
   JWT_SECRET  = gamespark_super_secret_key_change_this_2025
   FRONTEND_URL = https://gamespark-28sk.netlify.app
   PORT = 5001
   ADMIN_EMAIL = your@email.com
   ADMIN_PASSWORD = YourAdminPassword123
6. Click "Create Web Service"
7. Wait 2-3 minutes for deploy
8. Copy your backend URL — looks like: https://gamespark-api.onrender.com

─────────────────────────────────────────────────────────────
STEP 3 — GET GAMEPIX API KEY (1500+ games)
─────────────────────────────────────────────────────────────
1. Go to: gamepix.com
2. Click "Publishers" → "Sign Up"
3. Fill in your website: gamespark-28sk.netlify.app
4. Wait for approval (usually 1-2 days)
5. Once approved, copy your API key
6. Open: frontend/.env
7. Replace REACT_APP_GAMEPIX_KEY=YOUR_GAMEPIX_API_KEY
   with your real key

─────────────────────────────────────────────────────────────
STEP 4 — UPDATE FRONTEND .env AND BUILD
─────────────────────────────────────────────────────────────
1. Open: frontend/.env
2. Set REACT_APP_API_URL = https://gamespark-api.onrender.com
   (your Render.com backend URL from Step 2)
3. Open a terminal in the /frontend folder
4. Run: npm install
5. Run: npm run build
6. This creates a /build folder — this is what you upload to Netlify

─────────────────────────────────────────────────────────────
STEP 5 — DEPLOY FRONTEND TO NETLIFY
─────────────────────────────────────────────────────────────
1. Go to: netlify.com → Login
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the /frontend/build FOLDER
   (Important: drag the BUILD folder, not the frontend folder)
4. Your site goes live at: gamespark-28sk.netlify.app
5. Test: open the URL and check games load

─────────────────────────────────────────────────────────────
STEP 6 — CREATE YOUR ADMIN ACCOUNT
─────────────────────────────────────────────────────────────
After deployment, create your admin account:

1. Go to your live site → Register
2. Use the SAME email you set in ADMIN_EMAIL in .env
3. After registering, manually update your role in MongoDB:
   - Go to Atlas → Browse Collections → users
   - Find your user → Edit → change role from "user" to "admin"
4. Login → you will see "Admin Panel" in the sidebar

─────────────────────────────────────────────────────────────
STEP 7 — APPLY FOR GOOGLE ADSENSE
─────────────────────────────────────────────────────────────
1. Go to: adsense.google.com
2. Sign in with Google → Get Started
3. Website: gamespark-28sk.netlify.app
4. Fill your name and address (for payment)
5. They give you a code snippet — looks like:
   <script data-ad-client="ca-pub-XXXXXXXX" ...>
6. Copy the "ca-pub-XXXXXXXX" number
7. Open frontend/.env → set REACT_APP_ADSENSE_ID=ca-pub-XXXXXXXX
8. Also open frontend/public/index.html → find ca-pub-XXXXXXXXXXXXXXXX
   → replace with your real publisher ID
9. Rebuild and redeploy the frontend
10. Wait 1-3 weeks for AdSense approval email

─────────────────────────────────────────────────────────────
STEP 8 — SET UP GAMEPIX REVENUE (earn from games)
─────────────────────────────────────────────────────────────
1. Once GamePix approves your publisher account
2. They will email you revenue share details
3. Add your bank/PayPal in their publisher dashboard
4. GamePix pays you for every ad shown inside their games
   on your website — automatically every month

─────────────────────────────────────────────────────────────
SEO CHECKLIST (done for you inside the code)
─────────────────────────────────────────────────────────────
✅ Title tags on every page
✅ Meta descriptions on every page
✅ Open Graph tags (Facebook, WhatsApp previews)
✅ Twitter Card tags
✅ Schema.org JSON-LD structured data
✅ sitemap.xml at /sitemap.xml
✅ robots.txt at /robots.txt
✅ Canonical URLs
✅ Netlify _redirects for SPA routing
✅ SEO keyword content section on homepage
✅ Category pages with unique SEO titles

─────────────────────────────────────────────────────────────
HOW TO PROMOTE YOUR WEBSITE (get traffic = get paid)
─────────────────────────────────────────────────────────────
Week 1-2: Share with friends and family on WhatsApp
Week 2-4: Post on Facebook gaming groups
Month 2: Submit to Google Search Console
Month 2: Share on Reddit r/indiegaming r/webgames
Month 3: Make YouTube shorts showing games on your site
Month 3+: SEO starts bringing organic Google traffic

─────────────────────────────────────────────────────────────
INCOME TIMELINE (realistic)
─────────────────────────────────────────────────────────────
Month 1: ₹0 (AdSense approval pending, building traffic)
Month 2: ₹500 - ₹2,000 (first AdSense income + GamePix)
Month 3: ₹2,000 - ₹8,000 (growing traffic)
Month 6: ₹10,000 - ₹40,000 (SEO kicking in)
Month 12: ₹30,000 - ₹1,00,000+ (established site)

─────────────────────────────────────────────────────────────
SUPPORT
─────────────────────────────────────────────────────────────
If anything is unclear, ask Claude step by step.
Go one step at a time — don't rush.

Good luck! GameSpark is built. Now it's time to grow it. 🚀
═══════════════════════════════════════════════════════════════
