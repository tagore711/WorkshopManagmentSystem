const express = require('express');
const router = express.Router();
const workshopDao = require('../daos/workshopDao'); // Import the Workshop DAO

// --- WORKSHOP CRUD & SEARCH ---

// GET /api/workshops (Corresponds to Load Workshops / getAllWorkshops)
router.get('/', async (req, res) => {
    try {
        const workshops = await workshopDao.getAllWorkshops();
        res.status(200).json(workshops);
    } catch (err) {
        console.error("Route error in GET /api/workshops:", err.message);
        res.status(500).json({ message: "Failed to fetch all workshops." });
    }
});

// GET /api/workshops/search?term=... (Corresponds to Search Workshop / searchWorkshop)
router.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required." });
    }
    try {
        const workshops = await workshopDao.searchWorkshopsByName(searchTerm);
        res.status(200).json(workshops);
    } catch (err) {
        console.error("Route error in GET /api/workshops/search:", err.message);
        res.status(500).json({ message: `Failed to search workshops for term: ${searchTerm}` });
    }
});

// GET /api/workshops/area/:areaName (Corresponds to Filter by Area / workshopbyarea)
router.get('/area/:areaName', async (req, res) => {
    const areaName = req.params.areaName;
    try {
        const workshops = await workshopDao.getWorkshopsByArea(areaName);
        res.status(200).json(workshops);
    } catch (err) {
        console.error(`Route error in GET /api/workshops/area/${areaName}:`, err.message);
        res.status(500).json({ message: `Failed to fetch workshops for area: ${areaName}` });
    }
});

// POST /api/workshops (Corresponds to Add Workshop / addWorkshop)
router.post('/', async (req, res) => {
    const workshop = req.body;
    
    // Basic validation
    if (!workshop.wkCode || !workshop.wkName || !workshop.wkArea || workshop.manpower === undefined) {
        return res.status(400).json({ message: "Missing required fields for Workshop." });
    }
    
    // Convert area name to title case
    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    workshop.wkArea = toTitleCase(workshop.wkArea);
    
    try {
        const rowCount = await workshopDao.addWorkshop(workshop);
        if (rowCount === 1) {
            res.status(201).json({ message: "Workshop added successfully (score calculated by DB trigger).", wkCode: workshop.wkCode });
        } else {
            res.status(500).json({ message: "Insertion failed, 0 rows affected." });
        }
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ message: `Workshop with code ${workshop.wkCode} already exists.` });
        }
        if (err.code === '23503') { // Foreign key violation (Area does not exist)
            return res.status(409).json({ message: `Area '${workshop.wkArea}' does not exist. Cannot assign workshop.` });
        }
        console.error("Route error in POST /api/workshops:", err.message);
        res.status(500).json({ message: "Failed to add workshop." });
    }
});

// --- REVENUE UPDATE MUST COME FIRST BEFORE GENERIC WORKSHOP UPDATE ---

// PUT /api/workshops/revenue/:wkcode/:year/:quarter (CRITICAL FIX: Explicit path for Revenue Update)
router.put('/revenue/:wkcode/:year/:quarter', async (req, res) => {
    const wkCode = parseInt(req.params.wkcode);
    const year = parseInt(req.params.year);
    const quarter = parseInt(req.params.quarter);
    const revenue = req.body; // The body contains updated sales/cost/profit

    // Ensure essential update fields are present
    if (revenue.total_sales === undefined || revenue.service_cost === undefined) {
        return res.status(400).json({ message: "Missing required update fields (total_sales, service_cost)." });
    }

    // Pass PKs from URL params and data from body to DAO
    const updatePayload = {
        ...revenue,
        wkcode: wkCode,
        year: year,
        quarter: quarter
    };

    try {
        const rowCount = await workshopDao.updateRevenue(updatePayload);
        if (rowCount === 1) {
            res.status(200).json({ message: "Revenue entry updated successfully (profit recalculated)." });
        } else if (rowCount === 0) {
            res.status(404).json({ message: "Revenue entry not found or no changes were made." });
        }
    } catch (err) {
        console.error("Route error in PUT /api/workshops/revenue:", err.message);
        res.status(500).json({ message: "Failed to update revenue entry." });
    }
});

// PUT /api/workshops/:code (Corresponds to Update Workshop / updateWkshp)
// This must be placed AFTER the specific Revenue update route to avoid conflicts.
router.put('/:code', async (req, res) => {
    const wkCode = parseInt(req.params.code);
    const workshop = { wkCode: wkCode, ...req.body };
    
    // Basic validation for essential update fields
    if (!workshop.wkName || !workshop.wkArea || workshop.manpower === undefined) {
        return res.status(400).json({ message: "Missing required update fields (wkName, wkArea, manpower, etc.)." });
    }

    // Convert area name to title case
    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    workshop.wkArea = toTitleCase(workshop.wkArea);

    try {
        const rowCount = await workshopDao.updateWorkshop(workshop);
        if (rowCount === 1) {
            res.status(200).json({ message: `Workshop code ${wkCode} updated successfully (score recalculated).` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `Workshop code ${wkCode} not found.` });
        } else {
             res.status(200).json({ message: `Workshop code ${wkCode} updated. Affected rows: ${rowCount}.` });
        }
    } catch (err) {
        console.error("Route error in PUT /api/workshops/:code:", err.message);
        res.status(500).json({ message: `Failed to update workshop code ${wkCode}.` });
    }
});

// DELETE /api/workshops/:code (Corresponds to Delete Workshop / deleteworkshop)
router.delete('/:code', async (req, res) => {
    const wkCode = parseInt(req.params.code);

    try {
        const rowCount = await workshopDao.deleteWorkshop(wkCode);
        if (rowCount === 1) {
            // Success: Cascading delete handled by DB (revenue and manages entries removed)
            res.status(200).json({ message: `Workshop code ${wkCode} and related records deleted successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `Workshop code ${wkCode} not found.` });
        }
    } catch (err) {
        console.error("Route error in DELETE /api/workshops/:code:", err.message);
        res.status(500).json({ message: `Failed to delete workshop code ${wkCode}.` });
    }
});

// --- REVENUE ROUTES (Linked to Workshops) ---

// GET /api/workshops/revenue (Corresponds to Load All Revenues / getallrevenues)
router.get('/revenue', async (req, res) => {
    try {
        const revenues = await workshopDao.getAllRevenues();
        res.status(200).json(revenues);
    } catch (err) {
        console.error("Route error in GET /api/workshops/revenue:", err.message);
        res.status(500).json({ message: "Failed to fetch all revenue records." });
    }
});

// GET /api/workshops/:code/revenue (Corresponds to Filter Revenues by Workshop / revenuebyworkshop)
router.get('/:code/revenue', async (req, res) => {
    const wkCode = parseInt(req.params.code);
    try {
        const revenues = await workshopDao.getRevenuesByWorkshop(wkCode);
        res.status(200).json(revenues);
    } catch (err) {
        console.error(`Route error in GET /api/workshops/${wkCode}/revenue:`, err.message);
        res.status(500).json({ message: `Failed to fetch revenues for workshop code ${wkCode}.` });
    }
});

// POST /api/workshops/revenue (Corresponds to Add Revenue / addrevenues)
router.post('/revenue', async (req, res) => {
    const revenue = req.body;
    
    if (!revenue.wkcode || !revenue.year || !revenue.quarter || revenue.total_sales === undefined) {
        return res.status(400).json({ message: "Missing required fields for Revenue (wkcode, year, quarter, total_sales)." });
    }
    
    try {
        const rowCount = await workshopDao.addRevenue(revenue);
        if (rowCount === 1) {
            res.status(201).json({ message: "Revenue entry added successfully (profit calculated)." });
        } else {
            res.status(500).json({ message: "Insertion failed, 0 rows affected." });
        }
    } catch (err) {
        if (err.message.includes('already exists')) { 
            return res.status(409).json({ message: err.message });
        }
        if (err.code === '23503') { // Foreign key violation (Workshop code does not exist)
            return res.status(409).json({ message: `Workshop code ${revenue.wkcode} does not exist.` });
        }
        console.error("Route error in POST /api/workshops/revenue:", err.message);
        res.status(500).json({ message: "Failed to add revenue entry." });
    }
});

// DELETE /api/workshops/revenue/:wkcode/:year/:quarter (Corresponds to Delete Revenue / deleterevenue)
router.delete('/revenue/:wkcode/:year/:quarter', async (req, res) => {
    const wkCode = parseInt(req.params.wkcode);
    const year = parseInt(req.params.year);
    const quarter = parseInt(req.params.quarter);

    try {
        const rowCount = await workshopDao.deleteRevenue(wkCode, year, quarter);
        if (rowCount === 1) {
            res.status(200).json({ message: "Revenue entry deleted successfully." });
        } else if (rowCount === 0) {
            res.status(404).json({ message: "Revenue entry not found." });
        }
    } catch (err) {
        console.error("Route error in DELETE /api/workshops/revenue:", err.message);
        res.status(500).json({ message: "Failed to delete revenue entry." });
    }
});

module.exports = router;
