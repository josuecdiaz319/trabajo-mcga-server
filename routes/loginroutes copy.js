const mongoose = require('mongoose')
const userSchema = require('../models/user')
const User = mongoose.model('user', userSchema)

async function createUser(username, password) {
  return new User({
    username,
    password,
    created: Date.now()
  }).save()
}

async function findUser(username, password) {
  return await User.findOne({ username, password })
}

module.exports = (app) => {
    //app.post(`/api/login`, async (req, res) => {
      /*let product = await Product.create(req.body);
      return res.status(201).send({
        error: false,
        product
      })*/
    //});
    app.get(`/api/login/:username/:password`, async (req, res) => {
      const username = req.params.username, password = req.params.password
      console.log("Usuario:" + username + " Password:" + password)
      let connector
      try {
        connector = mongoose.connect('mongodb+srv://trabajomcga:asdasd123@cluster0-m319q.mongodb.net/test?retryWrites=true&w=majority', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      } catch (e) {
        handleError(error);
      }
      mongoose.connection.on('connected', async () => {
        console.log("Conexión a MongoDB exitosa");
        let user = await connector.then(async () => {
         return findUser(username, password)
        })

        if (!user) {
         user = await createUser(username, password)
         console.log("Creando usuario.")
        }
        else
        {
          console.log("Usuario encontrado.")
        }


      });
    });
}
