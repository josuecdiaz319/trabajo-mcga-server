const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    itemname: 
    {
      type: String,
      lowercase: true,
      required: true
    },
    description:
    {
      type: String,
      required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('item', itemSchema)