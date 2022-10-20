// ToDo:
// - Once form is submitted, make sure that there is not an already existing proposal 
//   created by that user. If it is, we add to the proposal, if not, create the proposal
// - Make "Image" proposal field so that it stores the correct image URL
// - Make dynamic radio buttons
// - The ability for the user to add titles to the options when you have multiple choices

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
  console.log(req.body)
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/shield/index.html'));
})

app.listen(3000);
