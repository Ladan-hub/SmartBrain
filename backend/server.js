const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "ladannazari",
    password: "",
    database: "smart-brain",
  },
});


const app = express();

//middle-wears
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send(database.users);
});

// Sign in
app.post("https://smart-brain-backend-mggx.onrender.com/signin", (req, res) => {
db.select("email", "hash").from('login')
  .where("email", "=", req.body.email)
  .then(data => { 
  const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
    if (isValid) {
   db.select('*').from('users')
  .where('email', '=', req.body.email)
  .then(user => {
  res.json(user[0])
  })
  .catch(error => res.status(400).json('unable to get user'))
  }
  })
  .catch(err => res.status(400).json('wrong credentials'))
});

// Register

app.post("https://smart-brain-backend-mggx.onrender.com/register", (req, res) => {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      // .then((data) => console.log(data[0].email))
      .then((data) => {
        return trx("users")
          .returning("*")
          .insert({
            email: data[0].email, // Pass the 'email' variable directly
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            const registeredUser = {
              id: user[0].id,
              name: user[0].name,
              email: user[0].email,
              entries: user[0].entries,
              joined: user[0].joined,
            };
            res.json(registeredUser);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
  }).catch((err) => res.status(400).json("unable to register"));
});

// Profile

// app.get("/profile/:id", (req, res) => {
//   const { id } = req.params;

//   database.users.forEach((user) => {
//     if (id === user.id) {
//       return res.json(user);
//     }
//   });
//   res.status(400).json("user not found");
// });

// Images

app.put("https://smart-brain-backend-mggx.onrender.com/image", (req, res) => {
  const { id } = req.body;

  
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to get entries'))
  

});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
