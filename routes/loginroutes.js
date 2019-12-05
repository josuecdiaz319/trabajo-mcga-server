const mongoose = require('mongoose')
const userSchema = require('../models/user')
const User = mongoose.model('user', userSchema)

async function createUser(username, password, email) {
  return new User({
    username,
    password,
    email
  }).save()
}

async function findUser(username, password) {
  return await User.findOne({ username, password })
}

async function existUser(username, email)
{
  let user = await User.findOne({ username })
  if(user)
  {
    return "Usuario existente.";
  }
  else
  {
    user = await User.findOne({ email })
    if(user)
    {
      return "E-mail existente";
    }
    else
    {
      return null;
    }
  }
}

function mongooseConnect()
{
  let conn = mongoose.connect('mongodb+srv://trabajomcga:asdasd123@cluster0-m319q.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  mongoose.connection.on('error', function (err) {
    console.log("Ha ocurrido un error en la conexión")
    console.log(err)
    process.exit(1)
   });
   return conn
}

module.exports = (app) => {

    app.post(`/api/login/`, async (req, res) => {
      const username = req.body.username, password = req.body.password
      console.log("LOGIN: Usuario:" + username + " Password:" + password)
      let connector = mongooseConnect()

      let user = await connector.then(async () => {
       return findUser(username, password)
      })

      if (user) 
      {
        res.json({message:"Credenciales correctas. Email: " + user.email})
      }
      else {
        res.json({message:"Credenciales inválidas."})
      }
     
    });

    app.post(`/api/register/`, async (req, res) => {
      const username = req.body.username, password = req.body.password, email = req.body.email
      console.log("REGISTER: Usuario:" + username + " Password:" + password + " Email: " + email)
      let connector = mongooseConnect()

      let message = await connector.then(async () => {
       return existUser(username, email)
      })

      if(message == null)
      {
        await createUser(username, password, email)
        res.json({message:'Usuario registrado.'})
      }
      else
      {
        res.json({message})
      }
      

    })
}
