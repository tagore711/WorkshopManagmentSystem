# Import Database Schema to Supabase - Manual Steps

Since PostgreSQL command-line tools aren't installed on your system, we'll use Supabase's web-based SQL Editor.

## Step 1: Open SQL Editor

1. Go to your Supabase dashboard (you should already be logged in)
2. Click on your project: **"KTM Workshop Management"**
3. In the left sidebar, look for the **SQL Editor** icon (looks like `</>` or database icon)
4. Click **"SQL Editor"**

## Step 2: Prepare the SQL Content

The schema file is located at:
```
c:\Users\aryan\OneDrive\Desktop\DESKTOP_IMP\KTM\pgadmin.sql
```

## Step 3: Copy Schema Content

1. Open the file `pgadmin.sql` in Notepad or VS Code
2. Select ALL content (Ctrl+A)
3. Copy it (Ctrl+C)

## Step 4: Run in SQL Editor

1. In the Supabase SQL Editor, create a **"New query"**
2. Paste the entire contents of `pgadmin.sql` (Ctrl+V)
3. Click **"Run"** or press **F5**
4. Wait for execution to complete

## Step 5: Verify Success

You should see messages like:
- "CREATE TABLE" for each table
- "CREATE FUNCTION" for triggers
- No errors

## What Comes Next?

Once the schema is imported, I will:
1. ✅ Update your Render backend environment variables automatically
2. ✅ Test the connection
3. ✅ Your app will be live with the new Supabase database!

---

## Connection Details for Reference

**Supabase Connection String:**
```
postgresql://postgres:2vfH8NErpLVrduyI@db.hqlavmhxafrfxbfirjpd.supabase.co:5432/postgres
```

**For Render Environment Variables:**
- PG_USER: `postgres`
- PG_HOST: `db.hqlavmhxafrfxbfirjpd.supabase.co`
- PG_DATABASE: `postgres`
- PG_PASSWORD: `2vfH8NErpLVrduyI`- PG_PORT: `5432`

---

## Let me know when you've completed the import!

Once you've run the SQL in Supabase and it completes successfully, tell me and I'll update your Render backend immediately!
