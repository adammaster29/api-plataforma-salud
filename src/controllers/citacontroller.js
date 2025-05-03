
const { poolpromise, sql } = require('../config/bd_config');



const postcita = async (req,res) => {
const {id_paciente,id_medico,fecha,padecimiento} = req.body;
if ( !id_paciente || !id_medico || !fecha || !padecimiento) {
  return  res.status(404).json({message : 'los datos no deben ir en blanco'})
 
}
try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_paciente', sql.Int , id_paciente)
    .input('id_medico', sql.Int, id_medico)
    .input('fecha', sql.DateTime, fecha)
    .input('padecimiento', sql.VarChar, padecimiento)
    .query('INSERT INTO citas (id_paciente,id_medico,fecha,padecimiento) VALUES (@id_paciente,@id_medico,@fecha,@padecimiento)')
    return res.status(200).json({message:'cita creada'})

    
} catch (error) {
    console.error(error);
    return res.status(400).json({message:'error al crear la citas',error:error.message})
}
}


const getcita = async (req, res) => {
    try {
      const pool = await poolpromise();
      const result = await pool.request()
        .query(`
          SELECT 
            c.id_cita,
            u.nombre AS nombre_paciente,
            u.apellido AS apellido_paciente,
            u.email  AS email_paciente,
            m.id_medico,
            mu.nombre AS nombre_medico,
            mu.apellido AS apellido_medico,
            c.fecha
          FROM citas c
          JOIN pacientes p ON c.id_paciente = p.id_paciente
          JOIN usuarios u ON p.id_usuario = u.id_usuario
          JOIN medicos m ON c.id_medico = m.id_medico
          JOIN usuarios mu ON m.id_usuario = mu.id_usuario
        `);
  
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
    }
  }
  


const putcita = async (req,res) => {
const {id} = req.params;
const {id_medico,fecha,padecimiento} = req.body;
if (!id_medico|| !fecha || !padecimiento) {
    res.status(404).json({message:'error no deben haber campos vacios'})
}

try {
    const pool = await poolpromise();
    await pool.request()
    .input('id', sql.Int,id)
    .input('id_medico',sql.Int, id_medico)
    .input('fecha', sql.DateTime, fecha)
    .input('padecimiento', sql.VarChar, padecimiento)
    .query('UPDATE  citas   SET id_medico=@id_medico, fecha=@fecha,@padecimiento WHERE id_cita=@id')
    res.status(201).json({message:'cita editada con exito'})
} catch (error) {
    console.error(error)
    res.status(400).json({message:'error al editar la cita',error:error.message})
}
}

const deletecita = async (req,res) =>{

  const {id} = req.params;
  try {
    const pool = await poolpromise();
     await pool.request()
     .input('id_cita', sql.Int,id)
     .query(' DELETE FROM citas WHERE id_cita=@id_cita ');
     res.status(201).json({message:'cita eliminada con exito'});
  } catch (error) {
    console.error(error)
    res.status(400).json({message:'error al eliminar  cita',error:error.message});
  }




}


module.exports = {postcita,getcita,putcita,deletecita}