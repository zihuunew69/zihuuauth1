const express = require('express');
const router = express.Router();
const { register, bindHWID, login } = require('../controllers/authController');

router.post('/register', register);

router.post('/bind-hwid', bindHWID);
router.post('/login', login);

module.exports = router;
