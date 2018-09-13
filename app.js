const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(['events', 'users']);
});

app.get('/users', (req, res) => {
  res.send([
    {
      id: 1,
      user_name: "bob.someone"
    },
    {
      id: 2,
      user_name: "alice.anyone"
    },
  ])
});

app.post('/users/1/events', (req, res) => {
  res.send({
    body: req.body
  })
  .status('201')
  .end();
});

module.exports = app;
