require('dotenv').config();
const express = require('express');
const cors = require('cors');
const poolpromise = require('./config/bd_config.js').poolpromise;
const rolrouter = require('./router/rolrouter.js');
const usuariorouter = require('./router/usuariorouter.js');
const pacienterouter = require('./router/pacienterouter.js');
const medicorouter = require('./router/medicorouter.js');
const citarouter = require('./router/citarouter.js');
const app = express();
app.use(cors());
app.use(express.json());
poolpromise()

// routers
app.use('/api/rol',rolrouter);
app.use('/api/usuario',usuariorouter);
app.use('/api/paciente',pacienterouter);
app.use('/api/medico',medicorouter);
app.use('/api/cita',citarouter);

const PORT = process.env.DB_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})