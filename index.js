const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

require('./routes/loginroutes')(app);


app.listen(5000, () => {
  console.log('Servidor ejecutándose...')
});
