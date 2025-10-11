// routes/aicRoutes.js

const express = require('express');
const router = express.Router();
const aicDao = require('../daos/aicDao'); // Import the DAO functions

// --- AREA IN-CHARGE (AIC) ROUTES ---

// GET /api/aics (Corresponds to Load Area ICs / getAllAICs)
router.get('/', async (req, res) => {
    try {
        const aics = await aicDao.getAllAICs();
        res.status(200).json(aics);
    } catch (err) {
        console.error("Route error in GET /api/aics:", err.message);
        res.status(500).json({ message: "Failed to fetch all Area In-Charges." });
    }
});

// GET /api/aics/search?term=... (Corresponds to Search / searchName)
router.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required." });
    }
    try {
        const aics = await aicDao.searchAICsByName(searchTerm);
        res.status(200).json(aics);
    } catch (err) {
        console.error("Route error in GET /api/aics/search:", err.message);
        res.status(500).json({ message: `Failed to search Area In-Charges for term: ${searchTerm}` });
    }
});

// POST /api/aics (Corresponds to Add / addentry)
router.post('/', async (req, res) => {
    const aic = req.body;
    
    if (!aic.ID || !aic.FirstName || !aic.LastName) {
        return res.status(400).json({ message: "Missing required fields for Area In-Charge (ID, FirstName, LastName)." });
    }
    
    try {
        const rowCount = await aicDao.addAIC(aic);
        if (rowCount === 1) {
            res.status(201).json({ message: "Area In-Charge added successfully.", ID: aic.ID });
        } else {
            res.status(500).json({ message: "Insertion failed, 0 rows affected." });
        }
    } catch (err) {
        if (err.code === '23505') { 
            return res.status(409).json({ message: `AIC with ID ${aic.ID} already exists.` });
        }
        console.error("Route error in POST /api/aics:", err.message);
        res.status(500).json({ message: "Failed to add Area In-Charge." });
    }
});

// PUT /api/aics/:id (Corresponds to Update / updateAICs)
router.put('/:id', async (req, res) => {
    const aicId = parseInt(req.params.id);
    const aic = { ID: aicId, ...req.body };
    
    if (!aic.FirstName || !aic.LastName) {
        return res.status(400).json({ message: "Missing required update fields (FirstName, LastName)." });
    }

    try {
        const rowCount = await aicDao.updateAIC(aic);
        if (rowCount === 1) {
            res.status(200).json({ message: `Area In-Charge ID ${aicId} updated successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `Area In-Charge ID ${aicId} not found.` });
        } else {
            res.status(200).json({ message: `Area In-Charge ID ${aicId} update anomaly detected, ${rowCount} rows affected.` });
        }
    } catch (err) {
        console.error("Route error in PUT /api/aics/:id:", err.message);
        res.status(500).json({ message: `Failed to update Area In-Charge ID ${aicId}.` });
    }
});

// DELETE /api/aics/:id (Corresponds to Delete / deleteAIC)
router.delete('/:id', async (req, res) => {
    const aicId = parseInt(req.params.id);

    try {
        const rowCount = await aicDao.deleteAIC(aicId);
        if (rowCount === 1) {
            res.status(200).json({ message: `Area In-Charge ID ${aicId} deleted successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `Area In-Charge ID ${aicId} not found.` });
        }
    } catch (err) {
        if (err.code === '23503') { 
            return res.status(409).json({ message: `Cannot delete AIC ID ${aicId} because they still manage one or more areas or workshop ICs. Please reassign or delete related records first.` });
        }
        console.error("Route error in DELETE /api/aics/:id:", err.message);
        res.status(500).json({ message: `Failed to delete Area In-Charge ID ${aicId}.` });
    }
});

// --- AREA ROUTES ---

// POST /api/aics/areas (FIX: Handles Area Creation)
router.post('/areas', async (req, res) => {
    const area = req.body;
    
    if (!area.Area_Name || !area.AIC_ID) {
        return res.status(400).json({ message: "Area Name and Area IC ID are required." });
    }
    
    const areaToSave = {
        area_name: area.Area_Name,
        ic: area.AIC_ID 
    };

    try {
        const rowCount = await aicDao.addArea(areaToSave);
        if (rowCount === 1) {
            res.status(201).json({ message: `Area '${area.Area_Name}' added successfully.` });
        }
    } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('does not exist')) {
            return res.status(409).json({ message: err.message });
        }
        console.error("Route error in POST /api/aics/areas:", err.message);
        res.status(500).json({ message: "Failed to add Area." });
    }
});

// GET /api/aics/areas (Corresponds to Load all Areas / getAllAreas)
router.get('/areas', async (req, res) => {
    try {
        const areas = await aicDao.getAllAreas();
        res.status(200).json(areas);
    } catch (err) {
        console.error("Route error in GET /api/aics/areas:", err.message);
        res.status(500).json({ message: "Failed to fetch all areas." });
    }
});

// DELETE /api/aics/areas/:areaName (Delete Area by name)
router.delete('/areas/:areaName', async (req, res) => {
    const areaName = req.params.areaName;
    try {
        const rowCount = await aicDao.deleteArea(areaName);
        if (rowCount === 1) {
            res.status(200).json({ message: `Area '${areaName}' deleted successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `Area '${areaName}' not found.` });
        }
    } catch (err) {
        if (err.code === '23503') {
            return res.status(409).json({ message: `Cannot delete area '${areaName}' because it is referenced by other records.` });
        }
        console.error("Route error in DELETE /api/aics/areas/:areaName:", err.message);
        res.status(500).json({ message: `Failed to delete area '${areaName}'.` });
    }
});

// GET /api/aics/:id/areas (Corresponds to Filter Areas by AIC ID / areabyic)
router.get('/:id/areas', async (req, res) => {
    const aicId = parseInt(req.params.id);
    
    try {
        const areas = await aicDao.getAreasByAIC(aicId);
        res.status(200).json(areas);
    } catch (err) {
        console.error(`Route error in GET /api/aics/${aicId}/areas:`, err.message);
        res.status(500).json({ message: `Failed to fetch areas for AIC ID ${aicId}.` });
    }
});

module.exports = router;