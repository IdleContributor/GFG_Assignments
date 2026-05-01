# Brevo SMTP Configuration Guide

## ✅ Correct Brevo SMTP Settings

For Brevo (formerly Sendinblue), use these exact settings:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-brevo-smtp-key
FROM_EMAIL=your-verified-sender@example.com
FROM_NAME=BlogSpace
```

## 🔑 Important Brevo Requirements

### 1. **SMTP Key (Not Password)**
- Go to: https://app.brevo.com/settings/keys/smtp
- Create an SMTP key if you don't have one
- Use this SMTP key as `SMTP_PASS` (NOT your Brevo account password)

### 2. **Verified Sender Email**
- The `FROM_EMAIL` must be verified in Brevo
- Go to: https://app.brevo.com/senders
- Add and verify your sender email address
- Use this exact email in `FROM_EMAIL`

### 3. **SMTP User**
- `SMTP_USER` is your Brevo login email (the email you use to log into Brevo)
- This is different from `FROM_EMAIL`

### 4. **Port Options**
Brevo supports multiple ports:
- **587** (recommended) - TLS/STARTTLS
- **465** - SSL (set `secure: true` in config)
- **25** - Not recommended

## 🧪 Testing Your Configuration

### Step 1: Test Locally
```bash
cd Assignments/A10/backend
npm run test:email
```

This will:
- Show your SMTP configuration
- Test the connection to Brevo
- Send a test email to your SMTP_USER email
- Show detailed error messages if it fails

### Step 2: Check Railway Environment Variables
Make sure these are set in Railway:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASS=your-brevo-smtp-key
FROM_EMAIL=your-verified-sender@example.com
FROM_NAME=BlogSpace
```

### Step 3: Check Brevo Dashboard
After testing, check:
1. **Email Activity**: https://app.brevo.com/email-activity
2. Look for sent emails or errors
3. Check if emails are in "Sent" or "Blocked" status

## ❌ Common Brevo Errors

### Error: "Invalid credentials"
**Cause:** Wrong SMTP key or email
**Fix:** 
- Verify `SMTP_USER` is your Brevo login email
- Verify `SMTP_PASS` is your SMTP key (not account password)
- Generate a new SMTP key if needed

### Error: "Sender not verified"
**Cause:** `FROM_EMAIL` is not verified in Brevo
**Fix:**
- Go to https://app.brevo.com/senders
- Add and verify the sender email
- Use the exact verified email in `FROM_EMAIL`

### Error: "Connection timeout"
**Cause:** Network/firewall blocking SMTP port
**Fix:**
- Try port 465 with `secure: true`
- Check Railway network settings
- Verify Brevo service is not down

### Error: "Daily sending limit exceeded"
**Cause:** Brevo free plan has daily limits (300 emails/day)
**Fix:**
- Check your Brevo plan limits
- Wait 24 hours for limit reset
- Upgrade plan if needed

## 📊 Brevo Free Plan Limits
- **300 emails per day**
- Unlimited contacts
- Email templates
- SMTP relay

## 🔍 Debugging Checklist

- [ ] SMTP_HOST is `smtp-relay.brevo.com`
- [ ] SMTP_PORT is `587`
- [ ] SMTP_USER is your Brevo login email
- [ ] SMTP_PASS is your SMTP key (not password)
- [ ] FROM_EMAIL is verified in Brevo dashboard
- [ ] FROM_EMAIL matches a verified sender
- [ ] Not exceeding daily sending limit (300/day)
- [ ] Test email script runs successfully locally
- [ ] Railway environment variables are set correctly
- [ ] No typos in environment variable names

## 🚀 After Configuration

1. **Commit and push** the updated code
2. **Verify Railway env vars** are correct
3. **Wait for redeploy**
4. **Test signup** on your live site
5. **Check Railway logs** for email sending messages
6. **Check Brevo dashboard** for email activity

## 📝 Example Railway Logs (Success)

```
Attempting to send OTP email to: user@example.com
SMTP Config - Host: smtp-relay.brevo.com, Port: 587, User: your-email@example.com
Email sent successfully! Message ID: <abc123@smtp-relay.brevo.com>
OTP email sent successfully to user@example.com
```

## 📝 Example Railway Logs (Failure)

```
Attempting to send OTP email to: user@example.com
SMTP Config - Host: smtp-relay.brevo.com, Port: 587, User: your-email@example.com
Failed to send OTP email: Invalid login: 535 Authentication failed
```

This tells you exactly what's wrong!
