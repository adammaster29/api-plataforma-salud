const express = require('express');
const { poolpromise, sql } = require('../config/bd_config.js');


const postpaciente = async (req, res) => {
    const { id_usuario,direccion,telefono,fecha_nacimiento} = req.body ;
    console.log("Datos recibidos:", req.body);

    if(!id_usuario || !direccion || !telefono || !fecha_nacimiento){
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    try {
const pool = await poolpromise();
        await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('direccion', sql.VarChar, direccion)
        .input('telefono', sql.VarChar, telefono)
        .input('fecha_nacimiento' , sql.Date, fecha_nacimiento)
        .query(' INSERT INTO pacientes (id_usuario,direccion,telefono,fecha_nacimiento) VALUES (@id_usuario,@direccion,@telefono,@fecha_nacimiento)')

        res.status(200).json({message:'paciente creado exitosamente'})
        
    } catch (error) {
        res.status(500).json({message:'error al crear  paciente vuelve a intentarlo'})
        console.error('Error al crear paciente:', error.message);

    }

}

// obtener los pacientes
const getpaciente = async (req,res)=>{
    try {
        const pool = await poolpromise();

        const result = await pool.request()
        .query('SELECT u.nombre, u.apellido, p.id_paciente, p.direccion, p.telefono, p.fecha_nacimiento FROM pacientes p JOIN usuarios u ON p.id_usuario = u.id_usuario')

        res.status(200).json(result.recordset)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'error al obtener los pacientes',error: error.message })
    }

}


const putpaciente = async (req,res)=>{
const {id} = req.params;
const {direccion,telefono,fecha_nacimiento} = req.body;

if (!direccion || !telefono || !fecha_nacimiento ) {
    res.status(400).json({message:'no pueden ir campos vacios'})
}
try {
    const pool = await poolpromise()
    await pool.request()
    .input('id_paciente', sql.Int , id)
    .input('direccion', sql.VarChar,direccion)
    .input('telefono', sql.VarChar,telefono)
    .input('fecha_nacimiento',sql.VarChar,fecha_nacimiento)
    .query(' UPDATE pacientes SET direccion=@direccion, telefono=@telefono,fecha_nacimiento=@fecha_nacimiento WHERE id_paciente=@id_paciente ')
    res.status(200).json({message:'usuario actualizado correctamente'})
} catch (error) {
    console.error(error)
    res.status(500).json({message:'error al actualizar',error:error.message})
}
}



const deletepaciente = async (req,res)=>{
const {id}= req.params;

try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_paciente',sql.Int,id)
    .query('DELETE FROM pacientes where id_paciente = @id_paciente')
    res.status(201).json({message:'paciente eliminado'})
} catch (error) {
    clg(error)
    res.status(500).json({message:'error al eliminar el paciente',error:error.message})
}

}



module.exports= {postpaciente,getpaciente,putpaciente,deletepaciente}