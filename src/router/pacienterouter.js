const express = require('express')
const { postpaciente, getpaciente, putpaciente, deletepaciente } = require('../controllers/pacientecontroller');

const router = express.Router()


router.post('/agregar',postpaciente);
router.get('/obtener',getpaciente);
router.put('/editar/:id',putpaciente);
router.delete('/eliminar/:id',deletepaciente);




module.exports = router