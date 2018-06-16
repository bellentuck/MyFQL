const fs = require('fs');
const path = require('path');

class Table {
  constructor(folderPath) {
    this._folderPath = folderPath;
  }

  static toFilename (id) {
    return id + '.json';
  }

  static toId (filename) {
    return filename.slice(0, -5);
  }

  read (id) {
    const filePath = path.join(this._folderPath, Table.toFilename(id));
    try {
      const fileContents = fs.readFileSync(filePath);
      return JSON.parse(fileContents);
    } catch (err) {
      // console.error(err);
    }
    // if (!fs.existsSync(filePath)) return;
  }

  getRowIds () {
    const folderContents = fs.readdirSync(this._folderPath);
    return folderContents.map(Table.toId);
  }
}

module.exports = Table;
