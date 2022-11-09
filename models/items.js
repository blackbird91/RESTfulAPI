const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'items.json'
);

module.exports = class Item {
  constructor(itemData) {
    this.user = itemData.user;
    this.title = itemData.title;
    this.image = itemData.image;
    this.description = itemData.description;
    this.date = new Date();
    this.tags = 'tag1, tag2';
    this.type = itemData.type;
    this.votes = [1, 3];
    this.members = 10;
  }

  save() {
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
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }

  static fetchById(itemId) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }

  static deleteByTitle(title) {
    Item.fetchAll(items => {
      const updatedItems = items.filter(item => item.title !== title);
      fs.writeFileSync(p, JSON.stringify(updatedItems), err => {
        console.log(err)
      });
    });
  }
};
