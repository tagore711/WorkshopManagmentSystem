// daos/wkicDao.js

const db = require('../db');

// --- WORKSHOP IN-CHARGE (WIC) CRUD & SEARCH ---

/**
 * Fetches all Workshop In-Charge records. (Corresponds to getAllWorkshopICs)
 * @returns {Promise<Array>} List of all WIC objects.
 */
async function getAllWICs() {
    const sql = `
        SELECT 
            id AS "WkICID", 
            fname AS "FName", 
            mname AS "MName", 
            lname AS "LName", 
            rating AS "Rating", 
            area_ic AS "AreaIC" 
        FROM workshop_ic
        ORDER BY id`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllWICs:", err);
        throw err;
    }
}

/**
 * Searches Workshop In-Charges by first name. (Corresponds to searchWorkshopIC)
 * @param {string} searchTerm - The name part to search for.
 * @returns {Promise<Array>} List of matching WIC objects.
 */
async function searchWICsByName(searchTerm) {
    const sql = `
        SELECT 
            id AS "WkICID", 
            fname AS "FName", 
            mname AS "MName", 
            lname AS "LName", 
            rating AS "Rating", 
            area_ic AS "AreaIC" 
        FROM workshop_ic 
        WHERE fname ILIKE $1
        ORDER BY id`;
    
    const params = [`%${searchTerm}%`];
    
    try {
        const result = await db.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error("Error in searchWICsByName:", err);
        throw err;
    }
}

/**
 * Fetches WIC records supervised by a specific Area In-Charge. (Corresponds to WorkshopICbyAreaIC)
 * @param {number} areaIcId - The ID of the supervising Area In-Charge.
 * @returns {Promise<Array>} List of WIC objects.
 */
async function getWICsByAreaIC(areaIcId) {
    const sql = `
        SELECT 
            id AS "WkICID", 
            fname AS "FName", 
            mname AS "MName", 
            lname AS "LName", 
            rating AS "Rating", 
            area_ic AS "AreaIC" 
        FROM workshop_ic 
        WHERE area_ic = $1
        ORDER BY id`;
    
    try {
        const result = await db.query(sql, [areaIcId]);
        return result.rows;
    } catch (err) {
        console.error("Error in getWICsByAreaIC:", err);
        throw err;
    }
}

/**
 * Inserts a new Workshop In-Charge record. (Corresponds to addWorkshopIC)
 * @param {object} wic - WIC object { WkICID, FName, MName, LName, Rating, AreaIC }.
 * @returns {Promise<number>} The number of affected rows.
 */
async function addWIC(wic) {
    const sql = `
        INSERT INTO workshop_ic (id, fname, mname, lname, rating, area_ic)
        VALUES ($1, $2, $3, $4, $5, $6)`;
    const params = [wic.WkICID, wic.FName, wic.MName, wic.LName, wic.Rating, wic.AreaIC];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            throw new Error(`WIC with ID ${wic.WkICID} already exists.`);
        }
        if (err.code === '23503') { // Foreign key violation (AreaIC does not exist)
            throw new Error(`Area IC ID ${wic.AreaIC} does not exist. Cannot assign WIC.`);
        }
        console.error("Error in addWIC:", err);
        throw err;
    }
}

/**
 * Updates an existing Workshop In-Charge record. (Corresponds to updateWkshpIC)
 * @param {object} wic - WIC object with updated values.
 * @returns {Promise<number>} The number of affected rows.
 */
async function updateWIC(wic) {
    const sql = `
        UPDATE workshop_ic 
        SET fname = $1, mname = $2, lname = $3, rating = $4, area_ic = $5
        WHERE id = $6`;
    const params = [wic.FName, wic.MName, wic.LName, wic.Rating, wic.AreaIC, wic.WkICID];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
         if (err.code === '23503') { // Foreign key violation (AreaIC does not exist)
            throw new Error(`Area IC ID ${wic.AreaIC} does not exist. Cannot update WIC.`);
        }
        console.error("Error in updateWIC:", err);
        throw err;
    }
}

/**
 * Deletes a Workshop In-Charge record by ID. (Corresponds to deletewkshpic)
 * @param {number} wicId - The ID of the WIC to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteWIC(wicId) {
    const sql = `DELETE FROM workshop_ic WHERE id = $1`;
    try {
        const result = await db.query(sql, [wicId]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteWIC:", err);
        throw err;
    }
}


// --- MANAGES RELATIONSHIP CRUD & FILTERING ---

/**
 * Fetches all Manages relationship records. (Corresponds to getAllManages)
 * @returns {Promise<Array>} List of all Manages objects.
 */
async function getAllManages() {
    const sql = `
        SELECT wk_code AS "WkshpID", ic_id AS "ICID" 
        FROM manages
        ORDER BY wk_code, ic_id`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllManages:", err);
        throw err;
    }
}

/**
 * Fetches WICs managing a specific workshop. (Corresponds to managesbyworkshop)
 * @param {number} wkshpId - The workshop code.
 * @returns {Promise<Array>} List of Manages objects (WIC IDs for a given workshop).
 */
async function getWICsByWorkshop(wkshpId) {
    const sql = `
        SELECT wk_code AS "WkshpID", ic_id AS "ICID" 
        FROM manages 
        WHERE wk_code = $1
        ORDER BY ic_id`;
    
    try {
        const result = await db.query(sql, [wkshpId]);
        return result.rows;
    } catch (err) {
        console.error("Error in getWICsByWorkshop:", err);
        throw err;
    }
}

/**
 * Fetches workshops managed by a specific WIC. (Corresponds to managesbyic)
 * @param {number} icId - The WIC ID.
 * @returns {Promise<Array>} List of Manages objects (Workshop IDs managed by a given WIC).
 */
async function getWorkshopsByWIC(icId) {
    const sql = `
        SELECT wk_code AS "WkshpID", ic_id AS "ICID" 
        FROM manages 
        WHERE ic_id = $1
        ORDER BY wk_code`;
    
    try {
        const result = await db.query(sql, [icId]);
        return result.rows;
    } catch (err) {
        console.error("Error in getWorkshopsByWIC:", err);
        throw err;
    }
}

/**
 * Inserts a new Manages relationship entry. (Corresponds to addManages)
 * @param {object} manages - Manages object { WkshpID, ICID }.
 * @returns {Promise<number>} The number of affected rows.
 */
async function addManagesEntry(manages) {
    const sql = `
        INSERT INTO manages (wk_code, ic_id)
        VALUES ($1, $2)`;
    const params = [manages.WkshpID, manages.ICID];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        if (err.code === '23505') { // Unique violation (already managing)
            throw new Error('This Workshop IC already manages this Workshop.');
        }
        if (err.code === '23503') { // Foreign key violation (Workshop or WIC does not exist)
            throw new Error('Workshop ID or Workshop IC ID does not exist.');
        }
        console.error("Error in addManagesEntry:", err);
        throw err;
    }
}

/**
 * Deletes a specific Manages relationship entry. (New CRUD function)
 * @param {number} wkshpId - The workshop code.
 * @param {number} icId - The WIC ID.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteManagesEntry(wkshpId, icId) {
    const sql = `
        DELETE FROM manages 
        WHERE wk_code = $1 AND ic_id = $2`;
    
    try {
        const result = await db.query(sql, [wkshpId, icId]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteManagesEntry:", err);
        throw err;
    }
}

module.exports = {
    // WIC exports
    getAllWICs,
    searchWICsByName,
    getWICsByAreaIC,
    addWIC,
    updateWIC,
    deleteWIC,
    
    // Manages exports
    getAllManages,
    getWICsByWorkshop,
    getWorkshopsByWIC,
    addManagesEntry,
    deleteManagesEntry
};