// ToDo:
// - Edit button, delete button
//   -- Can now access the correct item so now all you have to do is display the edit page
//      and then preload the data into the form for editing, then submit and show changes in
//      the file system
// - Read through the proton SDK docs and start messing with that within the application
// - Make "Image" proposal field so that it stores the correct image URL
//    -- Installed multer to handle the correct image url but need to be able to access the
//       request in order to utilize that library

const path = require('path');
const express = require('express');
const Joi = require('joi');
const fs = require('fs')

const Item = require('./models/items')

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/shield', (req, res) => {
    let data = JSON.parse(fs.readFileSync('data/items.json'));
    res.send(data);
});

app.post('/shield/add', (req, res) => {
  const schema = {
      user: Joi.string().min(3).required(),
      title: Joi.string().min(5).required(),
      image: Joi.string().required(),
      description: Joi.string().min(2).max(500).required(),
      tags: Joi.string().required(),
      type: Joi.string().required()
    }
  
    const { error } = Joi.validate(req.body, schema)
    if (error){
      res.status(401).send(error.details[0].message)
      return
    } else {
      res.send({'status': 200})
    }
  
    const item = new Item(req.body);
    item.save();
})

app.post('/shield/edit', (req, res) => {
  const updatedTitle = req.body.title
  const updatedImage = req.body.image
  const updatedDescription = req.body.description
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
    if (error){
      return res.status(401).send(error)
    } else {
      res.send({'status': 200})
    }

    Item.fetchAll(items => {
      let correctItem = items.find(item => item.title === req.body.id)
      correctItem.title = updatedTitle
      correctItem.image = updatedImage
      correctItem.description = updatedDescription
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/shield/index.html'));
})

app.listen(3000);
