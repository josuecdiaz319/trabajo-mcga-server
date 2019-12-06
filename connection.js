const mongoose = require('mongoose')


mongoose.set('useFindAndModify', false);

function mongooseConnect()
{
    mongoose.connect('mongodb+srv://trabajomcga:asdasd123@cluster0-m319q.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  mongoose.connection.on('error', function (err) {
    console.log("Ha ocurrido un error en la conexión")
    console.log(err)
    process.exit(1)
   });
}

module.exports = mongooseConnect