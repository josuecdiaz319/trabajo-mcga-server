const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
      jwt.sign({user}, 'laweacuantica', (err, token) => {
        if(!err)
        {
          res.json({token, message:"Credenciales correctas. Email: " + user.email})
        }
      })
    }
    else {
      res.json({message:"Credenciales inválidas."})
    }
  });

  app.post(`/api/register/`, async (req, res) => {
    const username = req.body.username, password = req.body.password, email = req.body.email
    console.log("REGISTER: Usuario:" + username + " Password:" + password + " Email: " + email)
    
    let message = await existUserAndEmail(username, email)

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

}
