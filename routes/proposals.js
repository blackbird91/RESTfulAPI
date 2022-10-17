const express = require('express');

const proposalController = require('../controllers/proposals');

const router = express.Router();

router.get('/', proposalController.getProducts);

module.exports = router;
