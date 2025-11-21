-- Sample Data for KTM Workshop Management System
-- Run this in Supabase SQL Editor to populate your database

-- ================================================
-- 1. INSERT AREA IN-CHARGES (Regional Managers)
-- ================================================

INSERT INTO area_incharge ("ID", "First Name", "Middle Name", "Last Name") VALUES
(101, 'Rajesh', 'Kumar', 'Sharma'),
(102, 'Priya', NULL, 'Patel'),
(103, 'Amit', 'Singh', 'Verma'),
(104, 'Sneha', 'Rani', 'Gupta'),
(105, 'Vikram', NULL, 'Reddy');

-- ================================================
-- 2. INSERT AREAS (Regions)
-- ================================================

INSERT INTO area (area_name, ic) VALUES
('North Delhi', 101),
('South Mumbai', 102),
('East Bangalore', 103),
('West Pune', 104),
('Central Hyderabad', 105);

-- ================================================
-- 3. INSERT WORKSHOP IN-CHARGES (Workshop Managers)
-- ================================================

INSERT INTO workshop_ic (id, fname, mname, lname, rating, area_ic) VALUES
(201, 'Arjun', 'Kumar', 'Singh', 8, 101),
(202, 'Meera', NULL, 'Desai', 9, 102),
(203, 'Rohan', 'Prakash', 'Nair', 7, 103),
(204, 'Kavya', 'Sree', 'Reddy', 10, 104),
(205, 'Sameer', NULL, 'Khan', 8, 105),
(206, 'Ananya', 'Rao', 'Iyer', 9, 101),
(207, 'Karthik', 'Dev', 'Menon', 7, 103);

-- ================================================
-- 4. INSERT WORKSHOPS
-- ================================================
-- Note: score is auto-calculated by trigger based on manpower, customer_visits, and recovery

INSERT INTO workshop (wk_code, wk_name, area, manpower, customer_visits, recovery) VALUES
(1001, 'KTM Service Center Alpha', 'North Delhi', 150, 2500, 'yes'),
(1002, 'KTM Hub Beta', 'South Mumbai', 200, 3200, 'yes'),
(1003, 'KTM Workshop Gamma', 'East Bangalore', 120, 1800, 'no'),
(1004, 'KTM Service Point Delta', 'West Pune', 180, 2800, 'yes'),
(1005, 'KTM Center Epsilon', 'Central Hyderabad', 100, 1500, 'no'),
(1006, 'KTM Express Zeta', 'North Delhi', 90, 1200, 'yes'),
(1007, 'KTM Pro Eta', 'East Bangalore', 160, 2600, 'yes');

-- ================================================
-- 5. INSERT MANAGES (Workshop IC -> Workshop relationships)
-- ================================================

INSERT INTO manages (wk_code, ic_id) VALUES
(1001, 201),  -- Arjun manages Workshop Alpha
(1002, 202),  -- Meera manages Workshop Beta
(1003, 203),  -- Rohan manages Workshop Gamma
(1004, 204),  -- Kavya manages Workshop Delta
(1005, 205),  -- Sameer manages Workshop Epsilon
(1006, 206),  -- Ananya manages Workshop Zeta
(1007, 207),  -- Karthik manages Workshop Eta
(1001, 206);  -- Ananya also helps at Workshop Alpha

-- ================================================
-- 6. INSERT REVENUE (Quarterly financial data)
-- ================================================
-- Note: profit is auto-calculated by trigger (total_sales - service_cost)

-- Q1 2024 Revenue
INSERT INTO revenue (wk_code, year, quarter, total_sales, service_cost) VALUES
(1001, 2024, 1, 500000, 320000),
(1002, 2024, 1, 650000, 410000),
(1003, 2024, 1, 380000, 250000),
(1004, 2024, 1, 520000, 340000),
(1005, 2024, 1, 350000, 230000);

-- Q2 2024 Revenue
INSERT INTO revenue (wk_code, year, quarter, total_sales, service_cost) VALUES
(1001, 2024, 2, 550000, 340000),
(1002, 2024, 2, 700000, 440000),
(1003, 2024, 2, 420000, 280000),
(1004, 2024, 2, 580000, 370000),
(1005, 2024, 2, 390000, 250000),
(1006, 2024, 2, 300000, 200000),
(1007, 2024, 2, 480000, 310000);

-- Q3 2024 Revenue
INSERT INTO revenue (wk_code, year, quarter, total_sales, service_cost) VALUES
(1001, 2024, 3, 580000, 355000),
(1002, 2024, 3, 750000, 465000),
(1003, 2024, 3, 450000, 295000),
(1004, 2024, 3, 610000, 390000),
(1005, 2024, 3, 420000, 270000),
(1006, 2024, 3, 330000, 215000),
(1007, 2024, 3, 510000, 330000);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- Run these after inserting to verify data

-- Check total records inserted
SELECT 
    'Area In-Charges' as table_name, COUNT(*) as count FROM area_incharge
UNION ALL
SELECT 'Areas', COUNT(*) FROM area
UNION ALL
SELECT 'Workshop ICs', COUNT(*) FROM workshop_ic
UNION ALL
SELECT 'Workshops', COUNT(*) FROM workshop
UNION ALL
SELECT 'Manages', COUNT(*) FROM manages
UNION ALL
SELECT 'Revenue', COUNT(*) FROM revenue;

-- View all workshops with their auto-calculated scores
SELECT wk_code, wk_name, area, manpower, customer_visits, recovery, score 
FROM workshop 
ORDER BY score DESC;

-- View revenue with auto-calculated profit
SELECT wk_code, year, quarter, total_sales, service_cost, profit 
FROM revenue 
ORDER BY year DESC, quarter DESC, wk_code;
