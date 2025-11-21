# Update Render Backend - Step by Step

## Your New Supabase Database Credentials

Copy these values - you'll need them in a moment:

```
PG_USER=postgres
PG_HOST=db.hqlavmhxafrfxbfirjpd.supabase.co
PG_DATABASE=postgres
PG_PASSWORD=2vfH8NErpLVrduyI
PG_PORT=5432
```

---

## Steps to Update Render Backend

### Step 1: Open Render Dashboard
1. Go to: https://dashboard.render.com
2. Log in if needed

### Step 2: Find Your Backend Service
1. Look for **"ktm-workshop-backend"** or your backend web service
2. Click on it to open

### Step 3: Go to Environment Variables
1. Click on the **"Environment"** tab in the left sidebar
2. You'll see a list of environment variables

### Step 4: Update Each Variable

**Find and update these 5 variables one by one:**

1. **PG_USER**
   - Old value: `ktm_user`
   - **New value:** `postgres`
   - Click "Edit" → Change value → Click "Save"

2. **PG_HOST**
   - Old value: `dpg-d3l8phndiees739cqkhg-a.singapore-postgres.render.com`
   - **New value:** `db.hqlavmhxafrfxbfirjpd.supabase.co`
   - Click "Edit" → Change value → Click "Save"

3. **PG_DATABASE**
   - Old value: `ktmdb_pg`
   - **New value:** `postgres`
   - Click "Edit" → Change value → Click "Save"

4. **PG_PASSWORD**
   - Old value: `Fo9LSV98atPCJ8zzIWocE3Eqbg2TFAMC`
   - **New value:** `2vfH8NErpLVrduyI`
   - Click "Edit" → Change value → Click "Save"

5. **PG_PORT** (if it exists, it should already be 5432, but verify)
   - **Value:** `5432`

### Step 5: Save Changes
- After updating all variables, Render will automatically trigger a **redeploy**
- This takes about 2-3 minutes

### Step 6: Verify Deployment
1. Watch the "Events" or "Logs" tab
2. Look for: **"Successfully connected to PostgreSQL"**
3. Wait until status shows **"Live"**

---

## What Happens Next?

Once the deployment completes:
- ✅ Your backend will connect to Supabase (new database)
- ✅ Your live app will start working again
- ✅ All API endpoints will function normally

---

## Need Help?

If you see any errors in the logs, let me know and I'll help troubleshoot!

**Go ahead and update those 5 environment variables now!**
