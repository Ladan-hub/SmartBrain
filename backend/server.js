const bcrypt = require("bcrypt-nodejs");
const express = require("express");
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

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data[0]);
//   });

const app = express();

//middle-wears
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// Sign in
app.post("/signin", (req, res) => {
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

app.post("/register", (req, res) => {
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
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
  }).catch((err) => res.status(400).json("unable to register"));

  // bcrypt.hash(password, null, null, function (err, hash) {
  //   // Store hash in your password DB.
  //   if (err) {
  //     res.status(500).json("Error occurred while hashing password");
  //     return;
  //   }

  //   res.json(newUser);
  // });
});

// Profile

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  database.users.forEach((user) => {
    if (id === user.id) {
      return res.json(user);
    }
  });
  res.status(400).json("user not found");
});

// Images

app.put("/image", (req, res) => {
  const { id } = req.body;

  database.users.forEach((user) => {
    if (id === user.id) {
      user.entries++;
      return res.json(user.entries);
    }
  });
  res.status(400).json("user not found");
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
