const express = require('express');

const proposalController = require('../controllers/proposals');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-proposal', proposalController.getAddProduct);

// /admin/add-product => POST
router.post('/add-proposal', proposalController.postAddProduct);

module.exports = router;
