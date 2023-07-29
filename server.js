const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Configuración de MongoDB
mongoose.connect('mongodb+srv://<ricardoloaiza>:<Mh1VDvr7wK8AzEao>@cluster0.63be1if.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint de registro de usuarios
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({
    username: username,
    password: password,
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al registrar el usuario');
    } else {
      res.status(200).send('Usuario registrado exitosamente');
    }
  });
});

// Endpoint de inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username, password: password }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al buscar el usuario');
    } else {
      if (foundUser) {
        res.status(200).send('Inicio de sesión exitoso');
      } else {
        res.status(401).send('Credenciales inválidas');
      }
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
