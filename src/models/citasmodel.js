

class citasModel {
    constructor(id_cita,id_paciente, id_medico,fecha) {
       this.id_cita = id_cita;
         this.id_paciente = id_paciente;
            this.id_medico = id_medico;
            this.fecha = fecha;
    }
}
module.exports = citasModel;