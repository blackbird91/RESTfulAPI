// ToDo:
// - Once form is submitted, make sure that there is not an already existing proposal 
//   created by that user. If it is, we add to the proposal, if not, create the proposal
// - Make "Image" proposal field so that it stores the correct image URL
// - Compare number of votes in user file to number of 'members' from proposal
// - Validate all input using Joi or look into validationErrors used for validation in NodeJS course

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const addProposalRoute = require('./routes/add-proposal');
const proposalRoutes = require('./routes/proposals');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/member', addProposalRoute);
app.use(proposalRoutes);

app.use(errorController.get404);

app.listen(3000);
