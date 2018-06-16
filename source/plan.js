class Plan {
  constructor() {
    this._limit = null;
    this._selected = null;
    this._criteria = null;
    this._joinData = [];
    this._joinCallback = null;
  }

  setLimit (limit) {
    this._limit = limit;
  }

  withinLimit (arr) {
    return !this._limit || arr.length < this._limit;
  }

  setSelected (row) {
    this._selected = row;
  }

  selectColumns(row) {
    if (!this._selected || this._selected[0] === '*') return row;
    return this._selected.reduce((narrowedRow, columnName) => {
      narrowedRow[columnName] = row[columnName];
      return narrowedRow;
    }, {});
  }

  setCriteria (criteria) {
    this._criteria = criteria;
  }

  setJoinData (data, callback) {
    this._joinData = this._joinData.concat(data);
    this._joinCallback = callback;
  }

  matchesRow (row) {
    if (!this._criteria) return true;
    for (let column in this._criteria) {
      if (!this._criteria.hasOwnProperty(column)) continue;
      const condition = this._criteria[column];
      if (
        (typeof condition === 'function' && !condition(row[column]))
        || condition !== row[column]
      ) return false;
    }
    return true;
  }

  getInitialRowIds (table) {
    if (!this._criteria) return table.getRowIds();
    // (1) split criteria
    const indexedCriteria = {};
    const nonIndexedCriteria = {};
    for (const column in this._criteria) {
      if (table.hasIndexTable(column)) {
        indexedCriteria[column] = this._criteria[column];
      } else {
        nonIndexedCriteria[column] = this._criteria[column];
      }
    }
    if (Object.keys(indexedCriteria).length === 0) {
      return table.getRowIds();
    }
    this._criteria = nonIndexedCriteria;
    // (2) find initial ids based off idx table and indexed criteria
    return Object.keys(indexedCriteria)
      .map(column => {
        const indexTable = table.getIndexTable(column);
        const indexKey = indexedCriteria[column]; // e.g. 1972
        return indexTable[indexKey];
      })
      .reduce((intersection, nextRowIds) => {
        return intersection.filter(id => nextRowIds.includes(id));
      });
  }
}

module.exports = Plan;
