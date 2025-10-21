// daos/aicDao.js

const db = require('../db');

/**
 * Fetches all Area In-Charge records. (Corresponds to getAllAICs)
 * @returns {Promise<Array>} List of all AIC objects.
 */
async function getAllAICs() {
    const sql = `SELECT "ID", "First Name" AS "FirstName", "Middle Name" AS "MiddleName", "Last Name" AS "LastName" FROM area_incharge ORDER BY "ID"`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllAICs:", err);
        throw err;
    }
}

/**
 * Searches Area In-Charges by name (First, Middle, or Last). (Corresponds to searchName)
 * @param {string} searchTerm - The name part to search for.
 * @returns {Promise<Array>} List of matching AIC objects.
 */
async function searchAICsByName(searchTerm) {
    // Uses ILIKE for case-insensitive search and OR to check all name fields.
    const sql = `
        SELECT "ID", "First Name" AS "FirstName", "Middle Name" AS "MiddleName", "Last Name" AS "LastName" 
        FROM area_incharge 
        WHERE "First Name" ILIKE $1 OR "Middle Name" ILIKE $1 OR "Last Name" ILIKE $1
        ORDER BY "ID"`;
    
    const params = [`%${searchTerm}%`]; // PostgreSQL uses $1, $2, etc. for parameterized queries.
    
    try {
        const result = await db.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error("Error in searchAICsByName:", err);
        throw err;
    }
}

/**
 * Inserts a new Area In-Charge record. (Corresponds to addentry)
 * @param {object} aic - AIC object { ID, FirstName, MiddleName, LastName }.
 * @returns {Promise<number>} The number of affected rows (should be 1 on success).
 */
async function addAIC(aic) {
    const sql = `
        INSERT INTO area_incharge ("ID", "First Name", "Middle Name", "Last Name")
        VALUES ($1, $2, $3, $4)`;
    const params = [aic.ID, aic.FirstName, aic.MiddleName, aic.LastName];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        console.error("Error in addAIC:", err);
        throw err;
    }
}

/**
 * Updates an existing Area In-Charge record. (Corresponds to updateAICs)
 * @param {object} aic - AIC object { ID, FirstName, MiddleName, LastName }.
 * @returns {Promise<number>} The number of affected rows.
 */
async function updateAIC(aic) {
    const sql = `
        UPDATE area_incharge 
        SET "First Name" = $1, "Middle Name" = $2, "Last Name" = $3 
        WHERE "ID" = $4`;
    const params = [aic.FirstName, aic.MiddleName, aic.LastName, aic.ID];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        console.error("Error in updateAIC:", err);
        throw err;
    }
}

/**
 * Deletes an Area In-Charge record by ID. (New CRUD function)
 * @param {number} aicId - The ID of the AIC to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteAIC(aicId) {
    const sql = `DELETE FROM area_incharge WHERE "ID" = $1`;
    try {
        const result = await db.query(sql, [aicId]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteAIC:", err);
        throw err;
    }
}

/**
 * Fetches all Area records. (Corresponds to getAllAreas)
 * @returns {Promise<Array>} List of all Area objects.
 */
async function getAllAreas() {
    const sql = `SELECT area_name AS "Area_Name", ic AS "AIC_ID" FROM area ORDER BY area_name`;
    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Error in getAllAreas:", err);
        throw err;
    }
}

/**
 * Fetches Area records supervised by a specific Area In-Charge. (Corresponds to areabyic)
 * @param {number} icid - The ID of the supervising Area In-Charge.
 * @returns {Promise<Array>} List of Area objects.
 */
async function getAreasByAIC(icid) {
    const sql = `
        SELECT area_name AS "Area_Name", ic AS "AIC_ID" 
        FROM area 
        WHERE ic = $1
        ORDER BY LOWER(area_name)`;
    
    try {
        const result = await db.query(sql, [icid]);
        return result.rows;
    } catch (err) {
        console.error("Error in getAreasByAIC:", err);
        throw err;
    }
}

/**
 * Inserts a new Area record. (FIX: Added Area creation logic)
 * @param {object} area - Area object { area_name, ic }.
 * @returns {Promise<number>} The number of affected rows.
 */
async function addArea(area) {
    const sql = `
        INSERT INTO area (area_name, ic)
        VALUES (TRIM($1), $2)`;
    const params = [area.area_name, area.ic];
    
    try {
        const result = await db.query(sql, params);
        return result.rowCount;
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            throw new Error(`Area '${area.area_name}' already exists.`);
        }
        if (err.code === '23503') { // Foreign key violation (AIC does not exist)
            throw new Error(`Area IC ID ${area.ic} does not exist. Cannot assign area.`);
        }
        console.error("Error in addArea:", err);
        throw err;
    }
}

/**
 * Deletes an Area record by name.
 * @param {string} areaName - The area_name to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteArea(areaName) {
    const sql = `DELETE FROM area WHERE LOWER(area_name) = LOWER($1)`;
    try {
        const result = await db.query(sql, [areaName]);
        return result.rowCount;
    } catch (err) {
        console.error("Error in deleteArea:", err);
        throw err;
    }
}


module.exports = {
    getAllAICs,
    searchAICsByName,
    addAIC,
    updateAIC,
    deleteAIC,
    getAllAreas,
    getAreasByAIC,
    addArea, // <-- NEW EXPORT: Area creation
    deleteArea
};