const path = require('path');
const express = require('express');
const Joi = require('joi');
const fs = require('fs');

const Item = require('./models/items');

const app = express();


// express.json to decifer json data from incoming requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GETs all data from items.json file 
app.get('/items', (req, res) => {
  //if (req.params.parameter) {
  // do this
  //   if (req.params.parameter === 'tag') {

  //   }

  //   if (req.params.parameter === 'proposal') {

  //   }

  //   if (req.params.parameter === 'poll') {

  //   }

  //   if (req.params.parameter === 'issue') {

  //   }

  // } else {
  //   let data = JSON.parse(fs.readFileSync('data/items.json'));
  //   res.send(data);
  // }
  let data = JSON.parse(fs.readFileSync('data/items.json'));
  res.send(data);
});

// POSTs items to the items.json file
// IF THERE IS NO AUTHENTICATED USER THE ADD BUTTON WILL NOT BE SHOWN !!!!!!!!!!!!!!!!
app.post('/post', (req, res) => {

  // Joi Schema = how the incoming input data is validated
  const schema = {
    user: Joi.string().min(6).max(12).required(),
    title: Joi.string().min(5).required(),
    image: Joi.string().required(),
    description: Joi.string().min(2).max(500).required(),
    tags: Joi.string().required(),
    type: Joi.string().required(),
    votes: Joi.array().required(),
    vote: Joi.number()
  }

  const { error } = Joi.validate(req.body, schema)
  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }

  const item = new Item(req.body);
  item.save();
});

app.post('/vote', (req, res) => {
  console.log('first');
  // Joi Schema = how the incoming input data is validated
  const schema = {
    vote: Joi.number()
  }

  const { error } = Joi.validate(req.body, schema)
  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }

  const item = new Item(req.body);
  item.vote();
});

// HERE WE HAVE TO CHECK IF THE USER THAT MADE THE POST IS AUTHENTICATED !!!!!!!!!!!!!!!!
app.put('/delete', (req, res) => {
  const correctItem = req.body
  Item.fetchAll(items => {
    let filteredItems = items.filter(item => item.title !== correctItem.title)
    let data = JSON.parse(fs.readFileSync('data/items.json'));
    data = filteredItems
    fs.writeFileSync('data/items.json', JSON.stringify(data))
  })
  res.send({ "status": 200 })
})

app.listen(3333);
