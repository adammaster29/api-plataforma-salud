const express = require('express');
const { postusuario, getusuario, putusuario, deleteusuario, login } = require('../controllers/usuariocontroller');
const router = express.Router();


router.post('/login',login);
router.post('/agregar',postusuario );
router.get('/obtener',getusuario );
router.put('/editar/:id',putusuario );
router.delete('/eliminar/:id',deleteusuario);


module.exports = router;