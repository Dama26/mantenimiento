const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/roles.middleware');

router.get('/', controller.getAll);
router.get('/:id', auth, controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', auth, allowRoles('admin'), controller.remove);

module.exports = router;
