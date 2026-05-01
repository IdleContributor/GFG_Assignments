# Deploy A9 and A10 (MERN Apps)

Both A9 and A10 are full-stack apps with MongoDB backends that need separate deployment.

---

## Assignment 9 Deployment

### Step 1: Deploy Backend on Railway

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Configure:
   - **Root Directory**: `Assignments/A9`
   - **Start Command**: `node index.js` (auto-detected)
5. Add **Environment Variables**:
   - Click **Variables** tab
   - Add these variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `PORT`: (Railway sets this automatically)
     - `NODE_ENV`: `production`
6. Click **Deploy**
7. Go to **Settings** → **Networking** → **Generate Domain**
8. Copy the Railway URL (e.g., `https://a9-backend.up.railway.app`)

### Step 2: Deploy Frontend on Vercel

A9 has a `public` folder with HTML/CSS/JS that needs to connect to the backend.

1. Update `Assignments/A9/public/script.js` or wherever API calls are made
2. Change API URL from `http://localhost:3000` to your Railway URL
3. The frontend is already included in the main Vercel deployment
4. No separate deployment needed - it's served by the backend

**Note:** A9 backend serves static files from `public/` folder, so visiting the Railway URL will show the frontend!

---

## Assignment 10 Deployment

### Step 1: Deploy Backend on Railway

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Configure:
   - **Root Directory**: `Assignments/A10/backend`
   - **Start Command**: `node index.js`
5. Add **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRES_IN`: `7d`
   - `COOKIE_EXPIRES_IN`: `7`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://gfg.simar.dev` (your frontend URL)
   - `SMTP_HOST`: Your SMTP host (for emails)
   - `SMTP_PORT`: Your SMTP port
   - `SMTP_USER`: Your SMTP username
   - `SMTP_PASS`: Your SMTP password
   - `FROM_EMAIL`: Your from email
   - `FROM_NAME`: `BlogSpace`
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
6. Click **Deploy**
7. Generate Domain and copy the URL (e.g., `https://a10-backend.up.railway.app`)

### Step 2: Update Frontend Environment

1. Edit `Assignments/A10/frontend/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_API_URL=https://a10-backend.up.railway.app
   ```

2. Build the frontend:
   ```bash
   cd Assignments/A10/frontend
   npm install
   npm run build
   cd ../../..
   ```

### Step 3: Update Vercel Configuration

The A10 frontend is already configured in the main `Assignments/vercel.json`. Just need to rebuild and redeploy:

```bash
git add Assignments/A10/frontend/dist
git commit -m "Build A10 frontend for production"
git push origin main
cd Assignments
vercel --prod
```

### Step 4: Update Master Landing Page

Add A9 and A10 cards to `Assignments/Master/index.html`:

```html
<!-- Assignment 9 -->
<div class="card">
  <div class="card__number">09</div>
  <h2 class="card__title">MongoDB CRUD</h2>
  <p class="card__description">Full-stack app with MongoDB, Mongoose, and CRUD operations.</p>
  <a href="//your-a9-railway-url.up.railway.app" target="_blank" rel="noopener noreferrer" class="card__button">View</a>
</div>

<!-- Assignment 10 -->
<div class="card">
  <div class="card__number">10</div>
  <h2 class="card__title">Blog Application</h2>
  <p class="card__description">Full-stack MERN blog with authentication, posts, drafts, and dark mode.</p>
  <a href="/a10" class="card__button">View</a>
</div>
```

---

## Important Notes

### MongoDB Setup
Both A9 and A10 need MongoDB. Use MongoDB Atlas (free tier):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Add to Railway environment variables

### CORS Configuration
Make sure backends allow your frontend domain:
- A9: Check `src/app.js` for CORS settings
- A10: Already configured in `backend/src/app.js`

### Environment Variables Checklist

**A9 Backend:**
- ✅ MONGO_URI
- ✅ PORT (auto-set by Railway)
- ✅ NODE_ENV

**A10 Backend:**
- ✅ MONGO_URI
- ✅ JWT_SECRET
- ✅ JWT_EXPIRES_IN
- ✅ COOKIE_EXPIRES_IN
- ✅ NODE_ENV
- ✅ CLIENT_URL
- ✅ SMTP credentials (for OTP emails)
- ✅ GOOGLE_CLIENT_ID

**A10 Frontend:**
- ✅ VITE_GOOGLE_CLIENT_ID
- ✅ VITE_API_URL

---

## Testing

After deployment:
- **A9**: Visit Railway URL → should show the frontend with MongoDB CRUD
- **A10**: Visit `gfg.simar.dev/a10` → should show the blog app
- Test login, signup, create posts, etc.

---

## Troubleshooting

### A9 or A10 backend not connecting to MongoDB
- Check Railway logs for connection errors
- Verify MONGO_URI is correct
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### A10 frontend can't reach backend
- Check CORS settings in backend
- Verify VITE_API_URL in frontend .env
- Check Railway backend logs for requests

### Google OAuth not working
- Update Google OAuth console with new URLs
- Add Railway backend URL to authorized origins
- Add frontend URL to authorized redirect URIs
