const fs = require('fs');
const path = require('path');
const FQL = require('./fql');

class Table {
  constructor(folderPath) {
    this._folderPath = folderPath;
    this._indexTables = {};
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
      const fileContents = fs.readFileSync(filePath); // how might we stream this?
      return JSON.parse(fileContents);
    } catch (err) {
      // console.error(err);
      return undefined;
    }
    // Alternately: if (!fs.existsSync(filePath)) return;
  }

  getRowIds () {
    const folderContents = fs.readdirSync(this._folderPath);
    return folderContents.map(Table.toId);
  }

  hasIndexTable (column) {
    return this._indexTables.hasOwnProperty(column);
  }
  addIndexTable (column) {
    const data = new FQL(this).get();
    this._indexTables[column] = data.reduce((idxTable, dataRow) => {
      if (!idxTable.hasOwnProperty(dataRow[column])) {
        idxTable[dataRow[column]] = [dataRow.id];
      } else {
        idxTable[dataRow[column]].push(dataRow.id);
      }
      return idxTable;
    }, {});
  }
  getIndexTable (column) {
    return this.hasIndexTable(column)
      ? this._indexTables[column]
      : {};
  }
}

module.exports = Table;
