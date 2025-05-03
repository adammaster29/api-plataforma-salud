const express = require('express');
const { postcita, getcita, putcita, deletecita } = require('../controllers/citacontroller');
const router = express.Router();


router.post('/agregar',postcita);
router.get('/obtener',getcita);
router.put('/editar/:id',putcita);
router.delete('/eliminar/:id',deletecita)


module.exports = router;
