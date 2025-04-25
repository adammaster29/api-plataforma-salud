const { postmedico, getmedico, putmedico, deletemedico } = require("../controllers/medicocontroller");
const express = require('express')
const router = express.Router();


router.post('/agregar',postmedico);
router.get('/obtener',getmedico);
router.put('/editar/:id',putmedico);
router.delete('/eliminar/:id',deletemedico);  


module.exports=router