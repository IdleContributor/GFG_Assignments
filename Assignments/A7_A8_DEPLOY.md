# Deploy A7 and A8 (Node.js Backend Apps)

A7 and A8 are Node.js backend applications that need separate deployment from the static frontend.

---

## Deploy on Railway

### Why Railway?
- Free tier with $5 monthly credit
- Easy GitHub integration
- Automatic deployments
- Better for Node.js apps with persistent processes

### Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git add Assignments/A7 Assignments/A8
   git commit -m "Add A7 and A8 backend apps"
   git push origin main
   ```

2. **Deploy A7**:
   - Go to https://railway.app
   - Sign in with GitHub
   - Click **New Project** → **Deploy from GitHub repo**
   - Select your repository
   - Click **Add variables** (if needed, Railway auto-detects Node.js)
   - In **Settings**:
     - **Root Directory**: `Assignments/A7`
     - **Start Command**: `node server.js` (Railway auto-detects this)
   - Click **Deploy**

3. **Deploy A8**:
   - Click **New Project** again
   - Select the same repository
   - In **Settings**:
     - **Root Directory**: `Assignments/A8`
     - **Start Command**: `node index.js`
   - Click **Deploy**

4. **Get URLs**:
   - Click on each service
   - Go to **Settings** → **Networking** → **Generate Domain**
   - A7 will be at: `https://[your-service].up.railway.app`
   - A8 will be at: `https://[your-service].up.railway.app`

5. **Update Master Landing Page**:
   - Copy the Railway URLs
   - Update `Assignments/Master/index.html` with the actual URLs
   - Commit and push
   - Redeploy main site: `cd Assignments && vercel --prod`

---

## Custom Domains (Optional)

If you want custom domains like `a7.gfg.simar.dev`:

1. In Railway project settings → **Networking** → **Custom Domain**
2. Add: `a7.gfg.simar.dev`
3. Railway will show you DNS records to add
4. Add CNAME record at your domain provider:
   - Name: `a7.gfg`
   - Value: `[provided by Railway]`

---

## Environment Variables

Railway auto-detects Node.js and sets `PORT` automatically. No additional config needed for A7 and A8.

---

## Testing

After deployment:
- **A7**: Visit the Railway URL, should show the Node.js server pages
- **A8**: Visit `/api/recipes` endpoint to test the REST API

---

## Notes

- Railway free tier: $5/month credit (enough for 2-3 small apps)
- Apps don't sleep (unlike Render free tier)
- Automatic deployments on git push
- Better performance than Render free tier
