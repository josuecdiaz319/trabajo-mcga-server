const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function createUser(username, password, email) {
  const salt = 10
  bcrypt.hash(password, salt, function(err, hash) {
    new User({
      username,
      password: hash,
      email
    }).save()
  });
}

async function findUser(username, password) {

  let userInDB = await User.findOne({ username })
  //console.log(userInDB.password + " " + password)
  if(userInDB != null)
  {
    if(await bcrypt.compare(password, userInDB.password))
    {
      return userInDB;
    }
    else
    {
      return null;
    }
  }
  else
  {
    return null;
  }
}

async function existUserAndEmail(username, email)
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

async function getUserbyUsername(username)
{
  return await User.findOne({username})
}

async function getUserbyEmail(email)
{
  return await User.findOne({email})
}


module.exports = (app) => {
  app.post(`/api/login/`, async (req, res) => {
    const username = req.body.username, password = req.body.password
    console.log("LOGIN: Usuario:" + username + " Password:" + password)

    let user = await findUser(username, password)

    if (user)
    {
      jwt.sign({user}, 'laweacuantica', { expiresIn: 600 }, (err, token) => { //600 segundos = 10 minutos
        if(err)
        {
          res.status(301).json({message:"Error al generar el token"})
        }
        else
        {
          res.status(200).json({token, message:"Credenciales correctas. Email: " + user.email})
        }
      })
    }
    else {
      res.status(300).json({message:"Credenciales inválidas."})
    }
  });

  app.post(`/api/register/`, async (req, res) => {
    const username = req.body.username, password = req.body.password, email = req.body.email
    console.log("REGISTER: Usuario:" + username + " Password:" + password + " Email: " + email)

    let message = await existUserAndEmail(username, email)

    if(message == null)
    {
      await createUser(username, password, email)
      res.status(200).json({message:'Usuario registrado.'})
    }
    else
    {
      res.status(300).json({message})
    }
  })

  app.get(`/api/getusername`, async(req, res) => {
    const token = req.headers.token;

  })

  app.get(`/api/userregistered/:username`, async(req, res) => {
    const username = req.params.username
    console.log("USERREGISTERED: Username: " + username)
    let user = await getUserbyUsername(username)
    if(user)
    {
      res.json({message:"Yes"})
    }
    else
    {
      res.json({message:"No"})
    }
  })

  app.get(`/api/emailregistered/:email`, async(req, res) => {
    const email = req.params.email
    console.log("USERREGISTERED: Email: " + email)
    let user = await getUserbyEmail(email)
    if(user)
    {
      res.json({message:"Yes"})
    }
    else
    {
      res.json({message:"No"})
    }
  })

  app.get(`/api/token`, async(req,res) => {
    const token = req.header('token')

    //console.log(token)

    jwt.verify(token, 'laweacuantica', function(err, decoded) {
        if(err)
        {
          res.status(300).json({message:"Token inválido"})
        }
        else
        {
          jwt.sign({user:decoded.user}, 'laweacuantica', { expiresIn: 60 }, (err, newtoken) => { //600 segundos = 10 minutos
            if(err)
            {
              res.status(301).json({message:"El token es válido pero hubo un error al generar el nuevo token"})
            }
            else
            {
              res.status(200).json({message:"Token válido", oldtoken: token, newtoken})
            }
          })
        }
    });

  })



}
