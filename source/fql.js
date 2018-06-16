const Plan = require('./plan');

class FQL {
  constructor(tableInstance) {
    this._table = tableInstance;
  }

  get () {
    const rows = this._table.getRowIds();
    return rows.map(id => this._table.read(id));
  }

  count () {
    return this._table.getRowIds().length;
  }
}

module.exports = FQL;
