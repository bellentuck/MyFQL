class Plan {
  constructor() {
    this._limit = null;
    this._selected = null;
    this._criteria = null;
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

  matchesRow (row) {
    if (!this._criteria) return true;
    for (let column in this._criteria) {
      const condition = this._criteria[column];
      if (typeof condition === 'function') {
        if (!condition(row[column])) return false;
      }
      if (condition !== row[column]) return false;
    }
    return true;
  }
}

module.exports = Plan;
