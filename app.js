const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
require("dotenv").config();

// Set pug template config
app.set("view engine", "pug");
app.set("views", "./public/views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1", {
  useNewUrlParser: true,
});

mongoose.connection.on("error", (error) => console.error(error.message));

let schema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { collection: "users" }
);

const User = mongoose.model("User", schema);

app.get("/", async (req, res) => {
  const users = await User.find();
  res.render("index", { users: users });
});

app.route('/register')
  .get((req, res) => {
    res.render("form");
  })
  .post(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  
    await user.save((error) => {
      if (error) return console.error(error.message);
      return res.redirect("/");
    });
  })

app.listen(port, () => console.log(`Listening on port ${port}!`));
