require('dotenv').config();
const express = require('express');
const {poolpromise, sql} = require('../config/bd_config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// login
//   crear un nuevo usuario
//  obtener todos los usuarios
//  actualizar un usuario
//  eliminar un usuario



const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    try {
        const pool = await poolpromise();

        // Consulta para obtener al usuario con su id_rol
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM usuarios WHERE email = @email');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Comparamos la contraseña en texto plano con el hash de la BD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Consultar el nombre del rol usando el id_rol del usuario
        const rolResult = await pool.request()
            .input('id_rol', sql.Int, user.id_rol)
            .query('SELECT nombre FROM roles WHERE id_rol = @id_rol');

        const rol = rolResult.recordset[0];

        //  token JWT
        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                email: user.email,
                rol: rol ? rol.nombre : 'Desconocido', 
            },
            process.env.BD_JWT, 
            { expiresIn: '1h' }
        );

        
        res.status(200).json({
            message: 'Login exitoso.',
            token,
            usuario: {
                id: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: rol ? rol.nombre : 'Desconocido' 
            }
        });

    } catch (error) {
        console.error('Error al hacer login:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};







const postusuario = async (req,res)=>{
    const {nombre,apellido,email,password,id_rol} = req.body;
    if (!nombre || !apellido|| !email || !password || !id_rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
try {
    const pool = await poolpromise();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT * FROM usuarios WHERE email = @email');
if (result.recordset.length > 0) {
    return res.status(409).json({ message: 'Este correo ya está registrado.' });
}
    await pool.request()
    .input('nombre', sql.VarChar, nombre)
    .input('apellido', sql.VarChar, apellido)
    .input('email', sql.VarChar, email)
    .input('password', sql.VarChar, hashedPassword)
    .input('id_rol', sql.Int, id_rol)
    .query('INSERT INTO usuarios (nombre,apellido,email,password,id_rol) VALUES (@nombre,@apellido,@email,@password,@id_rol)');
    res.status(201).json({message:'Usuario created successfully'});
} catch (error) {
    res.status(500).json({message:'Error al crear el usuario'});
}
}


const getusuario = async (req,res)=>{
    try {
        const pool = await poolpromise();
        const result = await pool.request()
        .query('SELECT u.id_usuario, u.nombre, u.apellido, u.email, r.nombre AS rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol');
        res.status(200).json(result.recordset);

    } catch (error) {
        res.status(500).json({message:'Error al obtener los usuarios'});
    }
}



const putusuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, password, id_rol } = req.body;

    if (!nombre || !apellido || !email || !password || !id_rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const pool = await poolpromise();

        // Verificar si el usuario existe
        const result = await pool.request()
            .input('id_usuario', sql.Int, id)
            .query('SELECT * FROM usuarios WHERE id_usuario = @id_usuario');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el correo está siendo usado por otro usuario
        const emailResult = await pool.request()
            .input('email', sql.VarChar, email)
            .input('id_usuario', sql.Int, id)
            .query('SELECT * FROM usuarios WHERE email = @email AND id_usuario != @id_usuario');

        if (emailResult.recordset.length > 0) {
            return res.status(409).json({ message: 'Este correo ya está registrado por otro usuario.' });
        }

        // Actualizar usuario
        await pool.request()
            .input('id_usuario', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('id_rol', sql.Int, id_rol)
            .query('UPDATE usuarios SET nombre = @nombre, apellido = @apellido, email = @email, password = @password, id_rol = @id_rol WHERE id_usuario = @id_usuario');

        res.status(200).json({ message: 'Usuario actualizado correctamente.' });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};


const deleteusuario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'El id es obligatorio.' });
    }

    try {
        const pool = await poolpromise();

        const result = await pool.request()
            .input('id_usuario', sql.Int, id)
            .query('DELETE FROM usuarios WHERE id_usuario = @id_usuario');

        // Validar si se eliminó alguna fila
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente.' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
};







module.exports = {
    login,
    postusuario,
    getusuario,
    putusuario,
    deleteusuario
}