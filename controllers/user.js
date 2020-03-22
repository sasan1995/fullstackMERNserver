const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

  console.log(req.body);
  const { email, password, repeatPassword, lastname, name } = req.body;

  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "contrasenias obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "las contrasenias no son iguales" });
    } else {
      bcrypt.hash(password, null, null, function(err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "error al encryptar la contrasenia" });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "el usuario ya existe" });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "error al crear el usuario" });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });

      // res.status(200).send({ message: "usurario creado" });
    }
  }
}

module.exports = {
  signUp
};
