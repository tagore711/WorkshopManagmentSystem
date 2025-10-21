const db = require('../db');

// --- WORKSHOP CRUD & SEARCH ---

/**
 * Fetches all Workshop records. (Corresponds to getAllWorkshops)
 * @returns {Promise<Array>} List of all Workshop objects.
 */
async function getAllWorkshops() {
    const sql = `
        SELECT 
            wk_code AS "wkCode", 
            wk_name AS "wkName", 
            area AS "wkArea", 
            manpower, 
            customer_visits AS "customer_visits", 
            recovery, 
            score 
        FROM workshop
        ORDER BY wk_code`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllWorkshops:", err);
        throw err;
    }
}

/**
 * Searches Workshops by name. (Corresponds to searchWorkshop)
 * @param {string} searchTerm - The name part to search for.
 * @returns {Promise<Array>} List of matching Workshop objects.
 */
async function searchWorkshopsByName(searchTerm) {
    const sql = `
        SELECT 
            wk_code AS "wkCode", 
            wk_name AS "wkName", 
            area AS "wkArea", 
            manpower, 
            customer_visits AS "customer_visits", 
            recovery, 
            score 
        FROM workshop 
        WHERE wk_name ILIKE $1
        ORDER BY wk_code`;

    const params = [`%${searchTerm}%`];

    try {
        const result = await db.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error("Error in searchWorkshopsByName:", err);
        throw err;
    }
}

/**
 * Fetches Workshop records by area name. (Corresponds to workshopbyarea)
 * @param {string} areaName - The area name to filter by.
 * @returns {Promise<Array>} List of Workshop objects.
 */
async function getWorkshopsByArea(areaName) {
    const sql = `
        SELECT 
            wk_code AS "wkCode", 
            wk_name AS "wkName", 
            area AS "wkArea", 
            manpower, 
            customer_visits AS "customer_visits", 
            recovery, 
            score 
        FROM workshop 
        WHERE LOWER(area) = LOWER($1)
        ORDER BY wk_code`;

    try {
        const result = await db.query(sql, [areaName]);
        return result.rows;
    } catch (err) {
        console.error("Error in getWorkshopsByArea:", err);
        throw err;
    }
}

/**
 * Inserts a new Workshop record. (Corresponds to addWorkshop)
 * @param {object} workshop - Workshop object.
 * @returns {Promise<number>} The number of affected rows.
 */
async function addWorkshop(workshop) {
    // Note: score will be calculated by the PostgreSQL trigger BEFORE INSERT.
    const sql = `
        INSERT INTO workshop (wk_code, wk_name, area, manpower, customer_visits, recovery)
        VALUES ($1, $2, TRIM($3), $4, $5, $6)`;
    const params = [
        workshop.wkCode,
        workshop.wkName,
        workshop.wkArea,
        workshop.manpower,
        workshop.customer_visits,
        workshop.recovery,
    ];

    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            throw new Error(`Workshop with code ${workshop.wkCode} already exists.`);
        }
        console.error("Error in addWorkshop:", err);
        throw err;
    }
}

/**
 * Updates an existing Workshop record. (Corresponds to updateWkshp)
 * @param {object} workshop - Workshop object with updated values.
 * @returns {Promise<number>} The number of affected rows.
 */
async function updateWorkshop(workshop) {
    // Note: score will be recalculated by the PostgreSQL trigger BEFORE UPDATE.
    const sql = `
        UPDATE workshop 
        SET wk_name = $1, area = TRIM($2), manpower = $3, customer_visits = $4, recovery = $5
        WHERE wk_code = $6`;
    const params = [
        workshop.wkName,
        workshop.wkArea,
        workshop.manpower,
        workshop.customer_visits,
        workshop.recovery,
        workshop.wkCode,
    ];

    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        console.error("Error in updateWorkshop:", err);
        throw err;
    }
}

/**
 * Deletes a Workshop record by code. (Corresponds to deleteworkshop)
 * @param {number} wkCode - The workshop code to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteWorkshop(wkCode) {
    // Note: ON DELETE CASCADE handles deleting related revenue and manages records.
    const sql = `DELETE FROM workshop WHERE wk_code = $1`;
    try {
        const result = await db.query(sql, [wkCode]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteWorkshop:", err);
        throw err;
    }
}

// --- REVENUE CRUD & FILTERING ---

/**
 * Fetches all Revenue records. (Corresponds to getallrevenues)
 * @returns {Promise<Array>} List of all Revenue objects.
 */
async function getAllRevenues() {
    const sql = `
        SELECT 
            wk_code AS "wkcode", 
            year, 
            quarter, 
            total_sales AS "total_sales", 
            service_cost AS "service_cost", 
            profit AS "profit" 
        FROM revenue
        ORDER BY year DESC, quarter DESC`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllRevenues:", err);
        throw err;
    }
}

/**
 * Fetches Revenue records by workshop code. (Corresponds to revenuebyworkshop)
 * @param {number} wkCode - The workshop code.
 * @returns {Promise<Array>} List of Revenue objects.
 */
async function getRevenuesByWorkshop(wkCode) {
    const sql = `
        SELECT 
            wk_code AS "wkcode", 
            year, 
            quarter, 
            total_sales AS "total_sales", 
            service_cost AS "service_cost", 
            profit AS "profit" 
        FROM revenue 
        WHERE wk_code = $1
        ORDER BY year DESC, quarter DESC`;
    
    try {
        const result = await db.query(sql, [wkCode]);
        return result.rows;
    } catch (err) {
        console.error("Error in getRevenuesByWorkshop:", err);
        throw err;
    }
}

/**
 * Inserts a new Revenue record. (Corresponds to addrevenues)
 * @param {object} revenue - Revenue object.
 * @returns {Promise<number>} The number of affected rows.
 */
async function addRevenue(revenue) {
    // Note: profit will be calculated by the PostgreSQL trigger BEFORE INSERT.
    const sql = `
        INSERT INTO revenue (wk_code, year, quarter, total_sales, service_cost)
        VALUES ($1, $2, $3, $4, $5)`;
    const params = [
        revenue.wkcode,
        revenue.year,
        revenue.quarter,
        revenue.total_sales,
        revenue.service_cost,
    ];

    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        if (err.code === '23505') { // Unique violation (PK constraint)
            throw new Error(`Revenue entry already exists for Workshop ${revenue.wkcode}, Year ${revenue.year}, Quarter ${revenue.quarter}.`);
        }
        console.error("Error in addRevenue:", err);
        throw err;
    }
}

/**
 * Updates an existing Revenue record. (Corresponds to updateRevenue)
 * @param {object} revenue - Revenue object with PK (wkcode, year, quarter) and updated sales/cost.
 * @returns {Promise<number>} The number of affected rows.
 */
async function updateRevenue(revenue) {
    // Note: profit will be recalculated by the PostgreSQL trigger BEFORE UPDATE.
    const sql = `
        UPDATE revenue 
        SET total_sales = $1, service_cost = $2 
        WHERE wk_code = $3 AND year = $4 AND quarter = $5`;
    const params = [
        revenue.total_sales,
        revenue.service_cost,
        revenue.wkcode,
        revenue.year,
        revenue.quarter,
    ];

    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        console.error("Error in updateRevenue:", err);
        throw err;
    }
}

/**
 * Deletes a Revenue record by its composite key. (Corresponds to deleterevenue)
 * @param {number} wkCode - The workshop code.
 * @param {number} year - The year.
 * @param {number} quarter - The quarter.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteRevenue(wkCode, year, quarter) {
    const sql = `
        DELETE FROM revenue 
        WHERE wk_code = $1 AND year = $2 AND quarter = $3`;
    
    try {
        const result = await db.query(sql, [wkCode, year, quarter]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteRevenue:", err);
        throw err;
    }
}


module.exports = {
    // Workshop exports
    getAllWorkshops,
    searchWorkshopsByName,
    getWorkshopsByArea,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    
    // Revenue exports
    getAllRevenues,
    getRevenuesByWorkshop,
    addRevenue,
    updateRevenue,
    deleteRevenue,
};
