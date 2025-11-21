# Getting Your Supabase Connection String

## Your Project Info:
- **Project Name**: KTM Workshop Management  
- **Project ID**: hqlavmhxafrfxbfirjpd
- **Password**: 2vfH8NErpLVrduyI
- **Region**: South Asia (Mumbai)

---

## Steps to Get Connection String:

### 1. Navigate to Database Settings
- You're currently in **Project Settings**
- Look at the **left sidebar** under "CONFIGURATION"
- Click on **"Database"**

### 2. Find Connection String Section
- On the Database page, **scroll down**
- Look for a section called **"Connection string"** or **"Connection Info"**

### 3. Select URI Format
- You'll see tabs: Postgres, **URI**, JDBC, etc.
- Click on the **"URI"** tab

### 4. Copy the Connection String
- You'll see something like:
  ```
  postgresql://postgres.hqlavmhxafrfxbfirjpd:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
  ```

### 5. Replace Password Placeholder
- Where it says `[YOUR-PASSWORD]`, replace with: **2vfH8NErpLVrduyI**

### 6. Final Connection String
Should look like:
```
postgresql://postgres.hqlavmhxafrfxbfirjpd:2vfH8NErpLVrduyI@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Copy the complete string and share it!**

---

## What's Next:
Once you share the connection string, I will:
1. ✅ Import your database schema (pgadmin.sql)
2. ✅ Update your Render backend environment variables
3. ✅ Test the application
4. ✅ Your app will be live with the new database!
