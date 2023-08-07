var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/usuarios.html');
});

app.post('/register', async (req, res) => {
  var dbo = await MongoClient.connect(process.env.MONGODB_URL);
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  var user = { name: req.body.name, password: hash };
  dbo.collection("users").insertOne(user, function(err, res) {
    if (err) throw err;
    console.log("Usuario Registrado");
    dbo();
  });
  res.redirect('/');
});

app.post('/login', async (req, res) => {
    var dbo = await MongoClient.connect(process.env.MONGODB_URL);
    var user = dbo.collection('users').findOne({name: req.body.name});
    if(user){
        var login = bcrypt.compareSync(req.body.password, user.password);
        if(login){
            console.log("Logeado exitosamente!");
        }else{
            console.log("Username o Contraseña incorrecto!");
        }
    }
    res.redirect('/');
});

app.listen(3000, function() {
  console.log('El servidor esta en el Puerto 300');
});
