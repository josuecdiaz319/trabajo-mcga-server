const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

const mongooseConnection = require('./connection')
mongooseConnection()

require('./routes/loginroutes')(app);
require('./routes/itemroutes')(app);

app.listen(5000, () => {
  console.log('Servidor ejecutándose...')
});
