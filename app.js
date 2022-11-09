const path = require('path');
const express = require('express');
const Joi = require('joi');
const fs = require('fs');

//const Item = require('./models/items');

const app = express();


// express.json to decifer json data from incoming requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GETs all data from items.json file 
app.get('/items', (req, res) => {
  let data = JSON.parse(fs.readFileSync('data/items.json'));
  res.send(data);
});

// POSTs items to the items.json file
// IF THERE IS NO AUTHENTICATED VISIONARY TYPE USER THE ADD BUTTON WILL NOT BE SHOWN !!!!!!!!!!!!!!!!
app.post('/post', (req, res) => {
  // Schema = how the incoming input data is validated
  const schema = {
    user: Joi.string().min(3).required(),
    title: Joi.string().min(5).required(),
    image: Joi.string().required(),
    description: Joi.string().min(2).max(500).required(),
    tags: Joi.string().required(),
    type: Joi.string().required()
  }

  const { error } = Joi.validate(req.body, schema)
  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }
  // Calling imported Item model to use the save method 
  // and save the new incoming item post request
  const item = new Item(req.body);
  item.save();
})

// EDIT items in the items.json file
// HERE WE HAVE TO CHECK IF THE USER THAT MADE THE POST IS AUTHENTICATED !!!!!!!!!!!!!!!!
app.post('/edit', (req, res) => {
  // Grab necessary data from the incoming request body
  const itemId = req.body.id
  const updatedTitle = req.body.title
  const updatedImage = req.body.image
  const updatedDescription = req.body.description
  // Validate the incoming request input values with the schema
  const schema = {
    id: Joi.string().required(),
    title: Joi.string().min(5).required(),
    image: Joi.string().required(),
    description: Joi.string().min(2).max(500).required(),
    type: Joi.string().required(),
    date: Joi.string(),
    tags: Joi.string(),
    votes: Joi.array(),
    members: Joi.number(),
  }

  const { error } = Joi.validate(req.body, schema)
  if (error) {
    return res.status(401).send(error)
  } else {
    // If no errors, fetch the edited item from items.json, update the 
    // edited values and then writeFileSync the data back into the items.json file
    Item.fetchAll(items => {
      let correctItemIndex = items.indexOf(items.find(item => item.title === itemId))
      let data = JSON.parse(fs.readFileSync('data/items.json'));
      data[correctItemIndex].title = updatedTitle
      data[correctItemIndex].image = updatedImage
      data[correctItemIndex].description = updatedDescription
      fs.writeFileSync('data/items.json', JSON.stringify(data))
    })
  }
  res.send({ "status": 200 })
})

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

// GETs the main homepage where all items are displayed from the index.js file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// })

app.listen(3333);
