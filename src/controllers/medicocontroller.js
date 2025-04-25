const express  = require('express');
const { poolpromise, sql } = require('../config/bd_config')



const postmedico = async (req, res) => {
    const {id_usuario,especializacion} = req.body
     if(!id_usuario || !especializacion  ){
      return res.status(400).json({message:'campos vacios debes ingresar los datos'})
     }
    try {
        const pool = await poolpromise();
        await pool.request()
        .input('id_usuario',sql.Int,id_usuario)
        .input('especializacion', sql.VarChar,especializacion)
        .query('INSERT INTO medicos (id_usuario,especializacion) Values (@id_usuario,@especializacion)')

        res.status(201).json({message:'medico creado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'error al crear el medico', error: error.message})
    }
}

// obtener los medicos
const getmedico = async (req, res) => {
    try {
        const pool = await poolpromise();
        const result = await pool.request()
        .query('SELECT  u.nombre, u.apellido, u.email, m.especializacion , m.id_medico FROM medicos m  JOIN usuarios u  ON m.id_usuario = u.id_usuario')
        res.status(200).json(result.recordset)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'error al obtener el medico', error: error.message})
    }
}

const putmedico = async (req,res)=>{
const {id} = req.params;
const {especializacion} = req.body;
if( !especializacion  ){
    return res.status(400).json({message:'campos vacios debes ingresar los datos'}) }
try {
    const pool = await poolpromise();
     await pool.request()
     .input('id', sql.Int, id )
     .input('especializacion', sql.VarChar, especializacion)
     .query('UPDATE medicos SET especializacion=@especializacion WHERE id_medico = @id');
     res.status(200).json({message:'medico actualizado'})
} catch (error) {
    console.error(error);
    res.status(400).json({message:'error al actuaizar',error:error.message})
}
}

const deletemedico = async (req,res)=>{
const {id} = req.params;
try {
    const pool = await poolpromise();
     await pool.request()
     .input('id_medico', sql.Int, id)
     .query(' DELETE FROM medicos WHERE id_medico=@id_medico')
     res.status(200).json({message:'medico eliminado'}) 
} catch (error) {
    console.error(error);
    res.status(400).json({message:'error al eliminar',error:error.message})
}
}




module.exports ={ postmedico,getmedico,putmedico,deletemedico}