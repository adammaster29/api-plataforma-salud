const express = require('express');
const { getRoles, postRoles, putRoles, deleteRoles } = require('../controllers/rolcontroller');
const router = express.Router(); 


router.get('/obtener',getRoles);
router.post('/agregar',postRoles);
router.put('/editar/:id',putRoles);
router.delete('/eliminar/:id',deleteRoles);

module.exports = router;