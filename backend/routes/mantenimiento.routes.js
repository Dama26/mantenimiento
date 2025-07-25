const express = require('express');
const router = express.Router();
const controller = require('../controllers/mantenimiento.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', controller.getAll);
router.get('/:id', auth, controller.getById);
router.get('/:id/gastos', controller.getGastosByMantenimientoId);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', auth, controller.remove);


module.exports = router;
