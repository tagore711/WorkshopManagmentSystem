# Connect Supabase to pgAdmin - Step by Step Guide

## Prerequisites
- pgAdmin 4 installed on your computer
- Supabase database credentials (see SUPABASE_CREDENTIALS.txt)

---

## Step 1: Open pgAdmin

1. Launch **pgAdmin 4** on your computer
2. You should see the main pgAdmin interface with a left sidebar showing "Servers"

---

## Step 2: Register New Server

1. **Right-click** on "Servers" in the left sidebar
2. Select **"Register" → "Server..."**
3. A dialog box will open

---

## Step 3: Configure General Settings

In the **"General"** tab:
- **Name:** `KTM Supabase Database`
  (You can name it anything you like)

---

## Step 4: Configure Connection Settings

Click on the **"Connection"** tab and enter:

```
Host name/address: db.hqlavmhxafrfxbfirjpd.supabase.co
Port: 5432
Maintenance database: postgres
Username: postgres
Password: 2vfH8NErpLVrduyI
```

**IMPORTANT:** Check the box ☑ **"Save password"** so you don't have to enter it every time

---

## Step 5: Configure SSL Settings

Click on the **"SSL"** tab:
- **SSL mode:** Select **"Require"** from the dropdown

---

## Step 6: Save Configuration

1. Click the **"Save"** button at the bottom right
2. pgAdmin will attempt to connect to your Supabase database

---

## Step 7: Verify Connection

If successful, you should see:
```
Servers
└── KTM Supabase Database (Connected)
    └── Databases
        └── postgres
            └── Schemas
                └── public
                    └── Tables
                        ├── area
                        ├── area_incharge
                        ├── manages
                        ├── revenue
                        ├── workshop
                        └── workshop_ic
```

---

## Step 8: Explore Your Data

1. Expand **"Servers" → "KTM Supabase Database" → "Databases" → "postgres" → "Schemas" → "public" → "Tables"**
2. **Right-click** on any table (e.g., `workshop`)
3. Select **"View/Edit Data" → "All Rows"**
4. You'll see all your data in a spreadsheet-like view!

---

## Frequently Used Operations

### View Table Data
1. Navigate to table in tree view
2. Right-click → **"View/Edit Data" → "All Rows"**

### Run SQL Query
1. Right-click on database → **"Query Tool"**
2. Type your SQL query
3. Press **F5** or click **"Execute"**

### Export Data
1. Right-click on table
2. Select **"Backup..."**
3. Choose format (SQL, CSV, etc.)

### Import Data
1. Right-click on table
2. Select **"Import/Export..."**
3. Browse for file

---

## Troubleshooting

### Connection Error: "could not connect to server"
- **Check:** Firewall blocking outgoing connections
- **Solution:** Allow pgAdmin through Windows Firewall

### SSL Error: "SSL connection has been closed unexpectedly"
- **Check:** SSL Mode setting
- **Solution:** Ensure SSL mode is set to "Require" not "Verify-Full"

### Timeout Error
- **Check:** Internet connection
- **Solution:** Verify you can access: https://supabase.com

### Authentication Failed
- **Check:** Username and password
- **Solution:** Verify credentials in SUPABASE_CREDENTIALS.txt
- **Note:** Use username `postgres` (NOT `postgres.hglgxmhxafrfblrirjzd` for direct connection)

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  KTM SUPABASE DATABASE - PGADMIN CONNECTION     │
├─────────────────────────────────────────────────┤
│  Host: db.hqlavmhxafrfxbfirjpd.supabase.co     │
│  Port: 5432                                     │
│  Database: postgres                             │
│  Username: postgres                             │
│  Password: 2vfH8NErpLVrduyI                     │
│  SSL Mode: Require                              │
└─────────────────────────────────────────────────┘
```

---

## Useful SQL Queries to Try

### Count all records in each table
```sql
SELECT 
    'area_incharge' as table_name, COUNT(*) as count FROM area_incharge
UNION ALL
SELECT 'workshops', COUNT(*) FROM workshop
UNION ALL
SELECT 'revenue', COUNT(*) FROM revenue;
```

### View workshops with calculated scores
```sql
SELECT wk_code, wk_name, manpower, customer_visits, recovery, score 
FROM workshop 
ORDER BY score DESC;
```

### View revenue with calculated profits
```sql
SELECT w.wk_name, r.year, r.quarter, r.total_sales, r.service_cost, r.profit
FROM revenue r
INNER JOIN workshop w ON r.wk_code = w.wk_code
ORDER BY r.year DESC, r.quarter DESC;
```

---

## Tips & Tricks

✅ **Tip 1:** Bookmark frequently used queries in pgAdmin
✅ **Tip 2:** Use keyboard shortcuts: F5 (Execute), F7 (Find), F8 (Debug)
✅ **Tip 3:** Enable "Show activity bar" to monitor running queries
✅ **Tip 4:** Use the "Dashboard" tab to monitor database performance
✅ **Tip 5:** Right-click table → "Properties" to see column details and constraints

---

**You're all set! Your pgAdmin is now connected to Supabase!** 🎉
