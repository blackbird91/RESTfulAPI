'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const open = require('open');
const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const join_us_port = 3333;                  //Save the port number where your server will be listening
const axios = require('axios');

const { Octokit } = require("@octokit/core");
const fs = require('fs');

let gitData = {}; // here is where we store the response from Git

// authenticate to Git using Octokit with a personal autnetication token
const octokit = new Octokit({
  auth: "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",
});

async function gitCall(passData) {
  gitData = await octokit.request("GET /users/{username}", {
    username: passData
  });
}

app.use(express.static(__dirname + '/public_html')); // delete this line for production
app.use(express.json()); // delete this line for production

app.post('/', (request, response) => {
  const user = request.body.username;
  const gitUser = request.body.gitUsername;

  if (gitUser && !request.body.score) { // if we receive a git username
    gitCall(gitUser).then(function () {
      response.send({ "status": "200" });
      console.log('New Code lover join request.');
    }).catch(e => {
      response.send({ "status": "404" });
      console.log("Git username received doesn't exist.");
    });
  }
  // check if another username file with the same name exists, if not, write a new file
  if (!fs.existsSync('join-requests/git-' + gitUser + '.json')) {
    if (request.body.score) {
      const score = request.body.score;
      gitData = gitData.data;
      gitData.score = score;
      fs.writeFileSync('join-requests/git-' + gitUser + '.json', JSON.stringify(gitData));

      let rawScores = fs.readFileSync('join-requests/scores.json');
      rawScores = JSON.parse(rawScores);
      rawScores.scores[gitUser] = score;

      fs.writeFileSync('join-requests/scores.json', JSON.stringify(rawScores));
      response.send(rawScores);
      console.log('Added new github username: ' + gitUser + '.');
    }
  } else {
    response.send({ "status": "exists" });
    console.log("Username already received.")
  }


  if (user) { // if we receive a regular username
    // check if another username file with the same name exists, if not, write a new file
    if (!fs.existsSync('join-requests/' + user + '.json')) {
      if (request.body.contact) {
        fs.writeFileSync('join-requests/' + user + '.json', JSON.stringify(request.body));
        console.log('Added the contact details and answers for: ' + user + '.');
        response.send({ "status": "user-received" });
      } else {
        response.send({ "status": "200" });
        console.log('New Awareness creator join request.');
      }

    } else { response.send({ "status": "exists" }); console.log("Username already received."); }
  }
});



// Presale
// end of discounted weeks
const ws0 = new Date('2022-09-09T20:59:00.000Z');
const ws1 = new Date('2022-09-16T21:00:00.000Z');
const ws2 = new Date('2022-09-23T21:00:00.000Z');
const ws3 = new Date('2022-09-30T21:00:00.000Z');
const ws4 = new Date('2022-10-07T21:00:00.000Z');
const ws5 = new Date('2022-10-14T21:00:00.000Z');
const ws6 = new Date('2022-10-21T21:00:00.000Z');
const ws7 = new Date('2022-10-28T21:00:00.000Z');
const ws8 = new Date('2022-11-04T21:00:00.000Z');
const ws9 = new Date('2022-11-11T21:00:00.000Z');
const ws10 = new Date('2022-11-18T21:00:00.000Z');

const we0 = new Date('2022-09-16T21:00:00.000Z');
const we1 = new Date('2022-09-23T21:00:00.000Z');
const we2 = new Date('2022-09-30T21:00:00.000Z');
const we3 = new Date('2022-10-07T21:00:00.000Z');
const we4 = new Date('2022-10-14T21:00:00.000Z');
const we5 = new Date('2022-10-21T21:00:00.000Z');
const we6 = new Date('2022-10-28T21:00:00.000Z');
const we7 = new Date('2022-11-04T21:00:00.000Z');
const we8 = new Date('2022-11-11T21:00:00.000Z');
const we9 = new Date('2022-11-18T21:00:00.000Z');
const we10 = new Date('2022-12-02T21:00:00.000Z');

const discountStart = [ws0, ws1, ws2, ws3, ws4, ws5, ws6, ws7, ws8, ws9, ws10];
const discountEnd = [we0, we1, we2, we3, we4, we5, we6, we7, we8, we9, we10];
const discountRates = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
let currentWeek;
let userFile = new Object();
let currentDiscount;
const afterDate = (date1, date2) => date1 > date2;
const beforeDate = (date1, date2) => date1 < date2;

let stopLoop = false;
// method to compare dates and determine current week and discount rate
let dateComparisons = () => {
  const newDate = new Date();
  discountStart.forEach((date, i) => {
    const after = afterDate(newDate, date);
    const before = beforeDate(newDate, discountEnd[i]);
    const over = afterDate(newDate, discountEnd[10]);

    if (over === true) {
      currentWeek = 10; stopLoop = true;
    } else {
      if (after === true && before === true && stopLoop === false) {
        currentWeek = i;
        stopLoop = true;
      }
    }
  });
  currentDiscount = discountRates[currentWeek];
}

app.get('/presale-orders', (rq, rs) => {
  let allOrders = JSON.parse(fs.readFileSync('presale/all-orders.json'));
  let allStatus = JSON.parse(fs.readFileSync('presale/status.json'));
  let response = [allOrders, allStatus];
  rs.send(response);
});

app.get('/presale-orders/current_week', (rq, rs) => {
  dateComparisons();
  const disc = { 'discount': currentDiscount, "period": { 0: discountStart[currentWeek], 1: discountEnd[currentWeek] } };
  rs.send(disc);
});

app.get('/cancel/:id', (req, res) => {
  let allStatus = JSON.parse(fs.readFileSync('presale/status.json'));
  allStatus[req.params.id-1].status = 'cancelled';
  allStatus[req.params.id-1].string = 'cancelled';
  fs.writeFileSync('presale/status.json', JSON.stringify(allStatus));
  res.send(allStatus[req.params.id-1]);
});

app.get('/confirm/:id/:user/:tx', (req, res) => {
  let theUserFile;
  if (fs.existsSync('presale/'+req.params.user+'.json')) {
    theUserFile = JSON.parse(fs.readFileSync('presale/'+req.params.user+'.json'));
    let counter = 0;
    theUserFile.forEach((order, index) => {
      if (order.id === parseInt(req.params.id)) {
        counter += 1;
        theUserFile[index].tx = req.params.tx;
        fs.writeFileSync('presale/'+req.params.user+'.json', JSON.stringify(theUserFile));
        res.send({ 'status': '200' });
      }
      if (counter > 0) {
        console.log('The user pending order ID received does not match any of the user order IDs.');
        res.send({ 'status': '404' });
      }
    });
  } else {res.send({ 'status': '404' });}
});

app.post('/presale', (request, response) => {
  let req = request.body;

  // google recaptcha v3 verification
  if(req.recaptcha_token === undefined || req.recaptcha_token === '' || req.recaptcha_token === null)
  {response.send({"responseError" : "Something went wrong receiving the token."})}
  const secretKey = "6LcBOuYhAAAAAJL6Zs01QGVk0Qq2x15bbD70V7yG";
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.recaptcha_token;
  // check with gooogle if token is valid
  axios.post(verificationURL).then(function (r) {
    if (r.data.success) {
        userFile.date = new Date();
        let allOrdersEntry = new Object();
        userFile.id = 0;
        dateComparisons();
        userFile.user = req.user;
        userFile.currency = req.currency;
        userFile.discount = currentDiscount;
        userFile.tx = '';
        userFile.email = req.email;
        userFile.tokens = req.tokens + currentDiscount;
      
        allOrdersEntry.id = 0;
        allOrdersEntry.date = userFile.date;
        allOrdersEntry.user = req.user;
        allOrdersEntry.currency = req.currency;
        allOrdersEntry.discount = currentDiscount;
        allOrdersEntry.tokens = userFile.tokens;
      
        if (req.user && req.currency && req.email && req.tokens) { // we check if everything is there
            // open the all_orders.json file to add the order
            let allOrdersFile = fs.readFileSync('presale/all-orders.json'); // open the file
            let newEntry = JSON.parse(allOrdersFile);
            const newID = newEntry.length + 1;
            allOrdersEntry.id = newID;
            userFile.id = newID;
            newEntry.push(allOrdersEntry);
            fs.writeFileSync('presale/all-orders.json', JSON.stringify(newEntry));


            if (!fs.existsSync('presale/' + req.user + '.json')) {
              fs.writeFileSync('presale/' + req.user + '.json', JSON.stringify([userFile]));
            } else {
              let existingUserFile = fs.readFileSync('presale/' + req.user + '.json');
              existingUserFile = JSON.parse(existingUserFile);
              existingUserFile.push(userFile);
              fs.writeFileSync('presale/' + req.user + '.json', JSON.stringify(existingUserFile));
            }

            response.send({ 'status': '200', 'id': newID, 'discount': currentDiscount });

        } else {response.send({ "status": "404" });}
      }
  })
  .catch(function (error) {
    console.log(error);
  });
});


app.listen(join_us_port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${join_us_port}`);
});

open('http://127.0.0.1:3333');