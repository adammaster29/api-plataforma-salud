const express = require('express');
const {poolpromise, sql} = require('../config/bd_config.js');


// -- This function handles the retrieval of roles from the database.
// It takes the request and response objects as parameters, and uses the poolpromise function to connect to the database.
const getRoles = async (req,res)=>{
try {
    const pool = await poolpromise();
    const result = await pool.request().query('SELECT * FROM roles');
    res.status(200).json(result.recordset);
} catch (error) {
    console.error('Error fetching roles:', error);
    res.status(200).json({message:"Error fetching roles"});
}
}

// -- This function handles the creation of a new role in the database.
// It takes the request and response objects as parameters, extracts the role name and description from the request body,
const postRoles = async (req,res)=>{
const {nombre,descripcion} = req.body;
try {
    const pool = await poolpromise();
      await pool.request()
    .input('nombre', sql.VarChar, nombre)
    .input('descripcion', sql.VarChar, descripcion)
    .query('INSERT INTO roles (nombre,descripcion) VALUES (@nombre,@descripcion)')
    res.status(200).json({message:'Rol created successfully'});
} catch (error) {
    res.status(500).json({message:'Error creating rol'});
    console.error('Error creating rol:', error);
}
}

// -- This function handles the update of an existing role in the database............
// It takes the request and response objects as parameters, extracts the role ID from the request parameters and the new name and description from the request body,

const putRoles = async (req,res)=>{
const {id} = req.params;
const {nombre,descripcion} = req.body;
try {
    const pool = await poolpromise();
      await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar, nombre)
    .input('descripcion', sql.VarChar, descripcion)
    .query('UPDATE roles SET nombre=@nombre, descripcion=@descripcion WHERE id_rol=@id')
    res.status(200).json({message:'Rol updated successfully'});

} catch (error) {
    res.status(500).json({messsage:'Error updating rol'});
    console.error('Error updating rol:', error);
}
}

const deleteRoles = async (req,res)=>{
const {id} = req.params;
try {
    const pool = await poolpromise();
    await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM roles WHERE id_rol=@id')
    res.status(200).json({message:'Rol deleted successfully'});
} catch (error) {
    res.status(500).json({message:'Error deleting rol'});
    console.error('Error deleting rol:', error);
}

}


module.exports = {
    getRoles,
    postRoles,
    putRoles,
    deleteRoles
}