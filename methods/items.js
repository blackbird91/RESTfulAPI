const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'items.json'
);

module.exports = class Item {
  constructor(itemData) {
    this.id = 0;
    this.user = itemData.user;
    this.title = itemData.title;
    this.image = itemData.image;
    this.description = itemData.description;
    this.options = itemData.options;
    this.date = new Date();
    this.tags = itemData.tags;
    this.type = itemData.type;
    this.votes = itemData.votes;
    this.vote = itemData.vote;
    this.members = 10;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let items = [];
      if (!err) {
        items = JSON.parse(fileContent);
      }
      const id = items.length + 1;
      this.id = id;
      items.push(this);
      fs.writeFile(p, JSON.stringify(items), err => {
        console.log(err);
      });
    });
  }

  static vote(obj) {
    fs.readFile(p, (err, fileContent) => {
      let items = [];
      if (!err) {
        items = JSON.parse(fileContent);
      }
      // items.filter(item => item.title !== title); // need to filter, because the ID might not be the same as the index if someone deletes an item there will be a gap
      // items[obj.id - 1].votes[obj.vote] += 1;
      // fs.writeFile(p, JSON.stringify(items), err => {
      //   console.log(err);
      // });
    });
  }
};
