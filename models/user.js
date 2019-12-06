const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: 
  {
    type: String,
    lowercase: true,
    required: true
  },
  password:
  {
    type: String,
    required: true
  },
  email:
  {
    type: String,
    lowercase: true,
    required: true
  }
}, 
{
  timestamps: true
})

module.exports = mongoose.model('user', userSchema)
