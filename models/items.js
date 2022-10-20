const fs = require('fs');
const path = require('path');

module.exports = class Item {
  constructor(itemData) {
    this.title = itemData.title;
    this.image = itemData.image;
    this.description = itemData.description;
    this.date = new Date();
    this.tags = 'tag1, tag2';
    this.votes = [1,3];
    this.members = 10;
  }

  save() {
    const p = path.join(
      path.dirname(require.main.filename),
      'data',
      'items.json'
    );
    fs.readFile(p, (err, fileContent) => {
      let items = [];
      if (!err) {
        items = JSON.parse(fileContent);
      }
      items.push(this);
      fs.writeFile(p, JSON.stringify(items), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(
      path.dirname(require.main.filename),
      'data',
      'items.json'
    );
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
