const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { database } = require('./database/database');
const startWebSocketServer = require('./websocket');


dotenv.config();

database.connect();
const app = express();
app.use(cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE']}));
app.use(bodyParser.json());

//Import Routes
require('./routes/users')(app)
require('./routes/projects')(app)
require('./routes/virtualMachines')(app)

const port = process.env.PORT || 3000;
const s = app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
})

startWebSocketServer(s);
