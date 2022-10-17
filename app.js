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
