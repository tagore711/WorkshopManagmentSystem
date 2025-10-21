# KTM Workshop Management System - Test Examples

## 🚀 Quick Start Testing Guide

### Prerequisites
1. PostgreSQL database running
2. Database configured with pgadmin.sql schema
3. Environment variables set in `.env` file

---

## 📝 Test Data Examples

### 1. Area In-Charges (AICs)

```sql
-- Insert test Area In-Charges
INSERT INTO area_incharge (ID, FirstName, MiddleName, LastName) VALUES
(100, 'Aryan', 'Rajesh', 'Gadam'),
(101, 'Rovan', NULL, 'Mullangi'),
(102, 'Tagore', NULL, 'Jagata'),
(103, 'Priya', 'Kumar', 'Sharma');
```

**API Test:**
```bash
# Get all AICs
curl http://localhost:3000/api/aics

# Search AIC by name
curl http://localhost:3000/api/aics/search?term=Aryan
```

---

### 2. Areas

```sql
-- Insert test Areas
INSERT INTO areas (Area_Name, AIC_ID) VALUES
('North Region', 100),
('South Region', 101),
('East Region', 102),
('West Region', 103);
```

**API Test:**
```bash
# Get all areas
curl http://localhost:3000/api/aics/100/areas

# Get specific area
curl http://localhost:3000/api/aics/areas
```

---

### 3. Workshop In-Charges (WICs)

```sql
-- Insert test Workshop In-Charges
INSERT INTO workshop_incharge (WkICID, AreaIC, FName, MName, LName, Rating) VALUES
(200, 100, 'Rohit', NULL, 'Kumar', 8),
(201, 100, 'Sneha', 'Devi', 'Patel', 9),
(202, 101, 'Vikram', NULL, 'Singh', 7),
(203, 102, 'Anita', 'Rani', 'Verma', 10);
```

**API Test:**
```bash
# Get all WICs
curl http://localhost:3000/api/wics

# Search WIC by first name
curl http://localhost:3000/api/wics/search?term=Rohit
```

---

### 4. Workshops

```sql
-- Insert test Workshops
INSERT INTO workshop (wkCode, wkName, wkArea, manpower, customer_visits, recovery) VALUES
(1001, 'Downtown Service Center', 'North Region', 15, 120, 'yes'),
(1002, 'Highway Garage', 'North Region', 10, 85, 'yes'),
(1003, 'City Auto Works', 'South Region', 12, 95, 'no'),
(1004, 'Express Bike Service', 'East Region', 8, 60, 'yes'),
(1005, 'Premium Workshop', 'West Region', 20, 150, 'yes');
```

**API Test:**
```bash
# Get all workshops
curl http://localhost:3000/api/workshops

# Search workshop by name
curl http://localhost:3000/api/workshops/search?name=Downtown

# Get specific workshop
curl http://localhost:3000/api/workshops/1001
```

---

### 5. Manages Relationships (WIC manages Workshop)

```sql
-- Link WICs to Workshops they manage
INSERT INTO manages (WkshpID, ICID) VALUES
(1001, 200),
(1002, 201),
(1003, 202),
(1004, 203),
(1005, 200);  -- Rohit manages 2 workshops
```

**API Test:**
```bash
# Get workshops managed by WIC
curl http://localhost:3000/api/wics/200/manages

# Get WICs managing a workshop
curl http://localhost:3000/api/workshops/1001/manages
```

---

### 6. Revenue Records

```sql
-- Insert test Revenue data
INSERT INTO revenue (wkcode, year, quarter, total_sales, service_cost) VALUES
(1001, 2024, 1, 500000, 300000),
(1001, 2024, 2, 550000, 320000),
(1001, 2024, 3, 600000, 350000),
(1002, 2024, 1, 400000, 250000),
(1003, 2024, 1, 450000, 280000),
(1004, 2024, 1, 350000, 220000),
(1005, 2024, 1, 700000, 400000);
```

**API Test:**
```bash
# Get all revenue records
curl http://localhost:3000/api/workshops/revenue

# Get revenue for specific workshop
curl http://localhost:3000/api/workshops/1001/revenue
```

---

## 🧪 Complete Test Workflow

### Step 1: Start the Backend Server
```bash
cd c:\Users\aryan\OneDrive\Desktop\KTM
npm run dev
```

### Step 2: Start the Frontend (in new terminal)
```bash
npm run react
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

---

## 🎯 Testing Scenarios

### Scenario 1: Add New Area IC
1. Navigate to **Area ICs** tab
2. Fill in form:
   - ID: `104`
   - First Name: `Test`
   - Last Name: `User`
3. Click **Add IC**
4. Verify it appears in the table

### Scenario 2: Create Area with IC
1. Navigate to **Areas** tab
2. Fill in form:
   - Area Name: `Central Region`
   - Area IC ID: `104`
3. Click **Add Area**
4. Click on an Area IC row to see their areas

### Scenario 3: Add Workshop IC
1. Navigate to **Workshop ICs** tab
2. Fill in form:
   - WIC ID: `204`
   - Area IC ID: `104`
   - First Name: `New`
   - Last Name: `Manager`
   - Rating: `8`
3. Click **Add WIC**

### Scenario 4: Create Workshop
1. Navigate to **Workshops** tab
2. Fill in form:
   - Code: `1006`
   - Name: `Test Workshop`
   - Area: `Central Region`
   - Manpower: `10`
   - Customer Visits: `50`
   - Recovery: `Yes`
3. Click **Add Workshop**
4. Verify auto-calculated score appears

### Scenario 5: Link WIC to Workshop
1. Navigate to **Manages** tab
2. Fill in form:
   - Workshop Code: `1006`
   - WIC ID: `204`
3. Click **Establish Link**
4. Verify relationship appears in table

### Scenario 6: Add Revenue Record
1. Navigate to **Revenue** tab
2. Fill in form:
   - Workshop Code: `1006`
   - Year: `2024`
   - Quarter: `4`
   - Total Sales: `400000`
   - Service Cost: `250000`
3. Click **Add Revenue**
4. Verify auto-calculated profit: `150000`

---

## 🔍 Testing Search Functionality

### Search Area IC
1. Go to **Area ICs** tab
2. Type `Aryan` in search box
3. Click **Search**
4. Verify filtered results

### Search Workshop
1. Go to **Workshops** tab
2. Type `Downtown` in search box
3. Click **Search**
4. Verify filtered results

### Search WIC
1. Go to **Workshop ICs** tab
2. Type `Rohit` in search box
3. Click **Search**
4. Verify filtered results

---

## ✅ Expected Behaviors

### Automated Score Calculation (Workshops)
- **Formula**: `score = (manpower × 10) + (customer_visits × 0.5) + (recovery_bonus)`
- **Recovery Bonus**: 50 if recovery = 'yes', 0 otherwise
- **Example**: manpower=15, visits=120, recovery=yes
  - Score = (15 × 10) + (120 × 0.5) + 50 = **260**

### Automated Profit Calculation (Revenue)
- **Formula**: `profit = total_sales - service_cost`
- **Example**: sales=500000, cost=300000
  - Profit = 500000 - 300000 = **200000**

---

## 🐛 Debugging Tips

### If data doesn't appear:
1. Check PostgreSQL is running
2. Verify `.env` database credentials
3. Check browser console for errors (F12)
4. Check backend terminal for API errors

### If animations don't work:
1. Clear browser cache (Ctrl + Shift + Del)
2. Hard refresh page (Ctrl + F5)
3. Check if Tailwind CSS is loaded

### If database operations fail:
1. Run `pgadmin.sql` to ensure schema is correct
2. Check database connection in terminal
3. Test with curl commands first

---

## 📊 Sample Data Summary

After inserting all test data, you should have:
- **4 Area In-Charges** (IDs: 100-103)
- **4 Areas** (North, South, East, West)
- **4 Workshop In-Charges** (IDs: 200-203)
- **5 Workshops** (Codes: 1001-1005)
- **5 Manages Relationships**
- **7 Revenue Records**

---

## 🎨 Homepage Animation Test

1. Navigate to **Home** tab
2. Observe animations:
   - **Motorcycle icon**: Bounces continuously
   - **Real-Time box**: Slides in from left
   - **Analytics box**: Scales in from center
   - **Management box**: Slides in from right
3. **Hover test**: Move mouse over each box
   - Should scale up (110%)
   - Should show orange glow shadow
   - Transition should be smooth (500ms)

---

## 📝 Notes

- All IDs are auto-incremented in production
- Score and Profit are auto-calculated by database triggers
- Search is case-insensitive
- Orange (#FF6900) and Black theme throughout
- All animations are CSS-based for performance

---

## 🆘 Support

For issues or questions:
- Check `README.md` for setup instructions
- Review `pgadmin.sql` for database schema
- Verify all dependencies in `package.json` are installed

**Happy Testing! 🏍️⚡**
