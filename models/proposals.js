const fs = require('fs');
const path = require('path');

module.exports = class Proposal {
  constructor(voteData) {
    this.title = voteData.title;
    this.image = voteData.image;
    this.description = voteData.description;
    this.date = voteData.date;
    this.tags = voteData.tags;
    this.votes = voteData.votes;
    this.members = voteData.members;
  }

  save() {
    const p = path.join(
      path.dirname(require.main.filename),
      'data',
      'proposals.json'
    );
    fs.readFile(p, (err, fileContent) => {
      let proposals = [];
      if (!err) {
        proposals = JSON.parse(fileContent);
      }
      proposals.push(this);
      fs.writeFile(p, JSON.stringify(proposals), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(
      path.dirname(require.main.filename),
      'data',
      'proposals.json'
    );
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
