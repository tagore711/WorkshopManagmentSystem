# 🚀 Supabase Setup - Step-by-Step Guide

## Step 1: Create Supabase Account

1. **Open your browser** and go to: https://supabase.com

2. **Click "Start your project"** button

3. **Sign up with GitHub** (recommended) or Google:
   - Click "Continue with GitHub"
   - Authorize Supabase

## Step 2: Create New Project

1. Once logged in, click **"New Project"**

2. **Fill in the project details**:
   - **Organization**: Select your organization (or create one)
   - **Name**: `KTM Workshop Management`
   - **Database Password**: **IMPORTANT - SAVE THIS PASSWORD!**
     - Generate a strong password OR use the auto-generated one
     - **Copy it to a safe place** (you'll need it later)
   - **Region**: Choose **Southeast Asia (Singapore)** (closest to your Render database region)
   - **Pricing Plan**: Keep on **Free** tier

3. **Click "Create new project"**
   - This will take 2-3 minutes to provision

## Step 3: Get Database Connection Details

Once your project is created:

1. Click on **"Project Settings"** (gear icon in bottom left)

2. Click **"Database"** in the left sidebar

3. Scroll down to find **"Connection string"**

4. Click on the **"URI"** tab (not Pooler)

5. You'll see a connection string like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the actual password you created in Step 2

7. **Copy this complete connection string** and paste it here in chat

---

## ⏸️ STOP HERE AND WAIT

**Once you have the connection string, paste it here and I'll help you:**
1. Import the database schema
2. Update your Render backend
3. Test the application

**Ready? Let me know when you have your Supabase connection string!**
