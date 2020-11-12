const express = require('express');
const { verifyTokenMiddle } = require('./middleware');

const router = express.Router();



router.post('/__protocol/aggregation', verifyTokenMiddle ,async (req, res) => {
    const { party_id } = req.body;
    
});

