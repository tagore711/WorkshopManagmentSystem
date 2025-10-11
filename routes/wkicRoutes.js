// routes/wkicRoutes.js

const express = require('express');
const router = express.Router();
const wkicDao = require('../daos/wkicDao'); // Import the WIC DAO

// --- WORKSHOP IN-CHARGE (WIC) ROUTES ---

// GET /api/wics (Corresponds to Load Workshop ICs / getAllWorkshopICs)
router.get('/', async (req, res) => {
    try {
        const wics = await wkicDao.getAllWICs();
        res.status(200).json(wics);
    } catch (err) {
        console.error("Route error in GET /api/wics:", err.message);
        res.status(500).json({ message: "Failed to fetch all Workshop In-Charges." });
    }
});

// GET /api/wics/search?term=... (Corresponds to Search WIC / searchWorkshopIC)
router.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required." });
    }
    try {
        const wics = await wkicDao.searchWICsByName(searchTerm);
        res.status(200).json(wics);
    } catch (err) {
        console.error("Route error in GET /api/wics/search:", err.message);
        res.status(500).json({ message: `Failed to search WICs for term: ${searchTerm}` });
    }
});

// GET /api/wics/area/:areaIcId (Corresponds to Filter WICs by Area IC / WorkshopICbyAreaIC)
router.get('/area/:areaIcId', async (req, res) => {
    const areaIcId = parseInt(req.params.areaIcId);
    try {
        const wics = await wkicDao.getWICsByAreaIC(areaIcId);
        res.status(200).json(wics);
    } catch (err) {
        console.error(`Route error in GET /api/wics/area/${areaIcId}:`, err.message);
        res.status(500).json({ message: `Failed to fetch WICs for Area IC ID ${areaIcId}.` });
    }
});

// POST /api/wics (Corresponds to Add WIC / addWorkshopIC)
router.post('/', async (req, res) => {
    const wic = req.body;
    
    if (!wic.WkICID || !wic.FName || wic.Rating === undefined || wic.AreaIC === undefined) {
        return res.status(400).json({ message: "Missing required WIC fields." });
    }
    
    try {
        const rowCount = await wkicDao.addWIC(wic);
        if (rowCount === 1) {
            res.status(201).json({ message: "Workshop In-Charge added successfully.", WkICID: wic.WkICID });
        } else {
            res.status(500).json({ message: "Insertion failed, 0 rows affected." });
        }
    } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('does not exist')) {
            return res.status(409).json({ message: err.message });
        }
        console.error("Route error in POST /api/wics:", err.message);
        res.status(500).json({ message: "Failed to add Workshop In-Charge." });
    }
});

// PUT /api/wics/:id (Corresponds to Update WIC / updateWkshpIC)
router.put('/:id', async (req, res) => {
    const wicId = parseInt(req.params.id);
    const wic = { WkICID: wicId, ...req.body };
    
    if (!wic.FName || wic.Rating === undefined || wic.AreaIC === undefined) {
        return res.status(400).json({ message: "Missing required update fields." });
    }

    try {
        const rowCount = await wkicDao.updateWIC(wic);
        if (rowCount === 1) {
            res.status(200).json({ message: `WIC ID ${wicId} updated successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `WIC ID ${wicId} not found.` });
        }
    } catch (err) {
         if (err.message.includes('does not exist')) {
            return res.status(409).json({ message: err.message });
        }
        console.error("Route error in PUT /api/wics/:id:", err.message);
        res.status(500).json({ message: `Failed to update WIC ID ${wicId}.` });
    }
});

// DELETE /api/wics/:id (Corresponds to Delete WIC / deletewkshpic)
router.delete('/:id', async (req, res) => {
    const wicId = parseInt(req.params.id);

    try {
        const rowCount = await wkicDao.deleteWIC(wicId);
        if (rowCount === 1) {
            res.status(200).json({ message: `WIC ID ${wicId} and managed entries deleted successfully.` });
        } else if (rowCount === 0) {
            res.status(404).json({ message: `WIC ID ${wicId} not found.` });
        }
    } catch (err) {
        console.error("Route error in DELETE /api/wics/:id:", err.message);
        res.status(500).json({ message: `Failed to delete WIC ID ${wicId}.` });
    }
});

// --- MANAGES RELATIONSHIP ROUTES ---

// GET /api/wics/manages (Corresponds to Load All Manages / getAllManages)
router.get('/manages', async (req, res) => {
    try {
        const manages = await wkicDao.getAllManages();
        res.status(200).json(manages);
    } catch (err) {
        console.error("Route error in GET /api/wics/manages:", err.message);
        res.status(500).json({ message: "Failed to fetch all management relationships." });
    }
});

// GET /api/wics/manages/workshop/:wkshpId (Corresponds to Filter by Workshop / managesbyworkshop)
router.get('/manages/workshop/:wkshpId', async (req, res) => {
    const wkshpId = parseInt(req.params.wkshpId);
    try {
        const manages = await wkicDao.getWICsByWorkshop(wkshpId);
        res.status(200).json(manages);
    } catch (err) {
        console.error(`Route error in GET /api/wics/manages/workshop/${wkshpId}:`, err.message);
        res.status(500).json({ message: `Failed to fetch WICs managing workshop ${wkshpId}.` });
    }
});

// GET /api/wics/manages/ic/:icId (Corresponds to Filter by WIC / managesbyic)
router.get('/manages/ic/:icId', async (req, res) => {
    const icId = parseInt(req.params.icId);
    try {
        const manages = await wkicDao.getWorkshopsByWIC(icId);
        res.status(200).json(manages);
    } catch (err) {
        console.error(`Route error in GET /api/wics/manages/ic/${icId}:`, err.message);
        res.status(500).json({ message: `Failed to fetch workshops managed by IC ${icId}.` });
    }
});

// POST /api/wics/manages (Corresponds to Add Manages / addManages)
router.post('/manages', async (req, res) => {
    const manages = req.body; // { WkshpID, ICID }
    
    if (!manages.WkshpID || !manages.ICID) {
        return res.status(400).json({ message: "Missing required fields for management entry (WkshpID, ICID)." });
    }
    
    try {
        const rowCount = await wkicDao.addManagesEntry(manages);
        if (rowCount === 1) {
            res.status(201).json({ message: "Management relationship established successfully." });
        } else {
            res.status(500).json({ message: "Insertion failed, 0 rows affected." });
        }
    } catch (err) {
        if (err.message.includes('already manages') || err.message.includes('does not exist')) {
            return res.status(409).json({ message: err.message });
        }
        console.error("Route error in POST /api/wics/manages:", err.message);
        res.status(500).json({ message: "Failed to add management relationship." });
    }
});

// DELETE /api/wics/manages/:wkshpId/:icId (Corresponds to Delete Manages / deleteManagesEntry)
router.delete('/manages/:wkshpId/:icId', async (req, res) => {
    const wkshpId = parseInt(req.params.wkshpId);
    const icId = parseInt(req.params.icId);

    try {
        const rowCount = await wkicDao.deleteManagesEntry(wkshpId, icId);
        if (rowCount === 1) {
            res.status(200).json({ message: "Management relationship deleted successfully." });
        } else if (rowCount === 0) {
            res.status(404).json({ message: "Management relationship not found." });
        }
    } catch (err) {
        console.error("Route error in DELETE /api/wics/manages:", err.message);
        res.status(500).json({ message: "Failed to delete management relationship." });
    }
});


module.exports = router;