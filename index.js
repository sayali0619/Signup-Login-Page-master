const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./src/db/conn");
const path = require("path");
const hbs = require("hbs");
const Register = require("./src/models/registers");

const static_path = path.join(__dirname, "/public");
const template_path = path.join(__dirname, "/templates/views");
const partials_path = path.join(__dirname, "/templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    const registerUser = new Register({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    const registerd = await registerUser.save();
    res.status(200).render("dashboard");
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login check

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });

    if (userEmail.password === password) {
      res.status(200).render("dashboard");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (error) {
    res.status(400).send("Invalid Details");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
