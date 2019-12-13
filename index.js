const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
        });

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());



const mongooseConnection = require('./connection')
mongooseConnection()

require('./routes/loginroutes')(app);
require('./routes/itemroutes')(app);

app.listen(5000, () => {
  console.log('Servidor ejecutándose...')
});
