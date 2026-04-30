# 🚀 Deployment Guide for Vercel

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Add deployment config"
git push origin master
```

## Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 3: Deploy

```bash
vercel
```

When prompted, just press **Enter** for all questions (accept defaults)

## Step 4: Add Custom Domain

```bash
vercel domains add gfg.simar.dev
```

## Step 5: Configure DNS

Go to your domain provider (where you manage simar.dev) and add:
- **Type:** CNAME
- **Name:** gfg
- **Value:** cname.vercel-dns.com

## Step 6: Deploy to Production

```bash
vercel --prod
```

---

## ✅ What You'll Get:

- `gfg.simar.dev/` → Master landing page
- `gfg.simar.dev/a1` → Assignment 1
- `gfg.simar.dev/a2` → Assignment 2
- `gfg.simar.dev/a3` → Assignment 3
- `gfg.simar.dev/a4` → Assignment 4
- `gfg.simar.dev/a5` → Assignment 5
- `gfg.simar.dev/a6` → Assignment 6
- `gfg.simar.dev/a7` → Assignment 7
- `gfg.simar.dev/a8` → Assignment 8

---

## Troubleshooting:

### Routes not working?
Make sure `vercel.json` is in the Assignments folder and redeploy.

### React apps (A5-A8) not loading?
Vercel builds them automatically. Check the deployment logs in Vercel dashboard.

### Domain not connecting?
DNS changes take 5-30 minutes. Check with: `nslookup gfg.simar.dev`
