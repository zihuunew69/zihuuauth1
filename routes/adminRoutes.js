const express = require('express');
const router = express.Router();
const { generateKey } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');


router.get('/', adminController.renderAdminPage);
router.get('/users', adminController.getUsers);
router.get('/keys', adminController.getKeys);
router.post('/generate-key', generateKey);
router.post('/delete-user/:id', adminController.deleteUser);
router.put('/user/:id', adminController.updateUser);
router.post("/delete-key/:id", adminController.deleteKey);

module.exports = router;
