const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './public/views');

app.use(express.static('public'));
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/mongo-1', 
{ useNewUrlParser: true });

mongoose.connection.on('error', (error) => console.error(error.message));

let schema = mongoose.Schema({
  name: String,
  email: String,
  password: String
}, { collection: 'users' });

let User = mongoose.model('User', schema);

app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users: users });
});

app.get('/register', (req, res) => {
  res.render('form');
});

app.post('/register', async (req, res) => {
  const user = new User({ 
    name: req.body.name, 
    email: req.body.email,
    password: req.body.password 
  });

  await user.save((error) => {
    if (error) return console.error(error.message);
  });
  res.redirect('../');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

