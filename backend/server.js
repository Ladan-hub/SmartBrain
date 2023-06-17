const express = require("express");
const app = express();
app.use(express.json());

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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

// Register

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
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

/*

/ res --> 'this is working'

/signin --> POST --> success/fail

/register --> POST --> user(obj)

/profile/:userId -->  GET --> user(obj)

/image --> PUT user


*/
