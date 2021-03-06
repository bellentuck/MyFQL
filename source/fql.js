const Plan = require('./plan');

class FQL {
  constructor(tableInstance, plan = new Plan()) {
    this._table = tableInstance;
    this._plan = plan;
  }

  get () {
    const rowIds = this._plan.getInitialRowIds(this._table);

    const results = [];
    const iterCondition = this._plan._limit
      ? () => this._plan.withinLimit(results)
      : () => rowIds.length;

    while (iterCondition()) {
      let row = this._table.read(rowIds.shift());

      // 'join' clauses:
      if (this._plan._joinData.length) {
        for (const joinRow of this._plan._joinData) {
          if (this._plan._joinCallback(joinRow, row)) {
            results.push(FQL.merge(joinRow, row));
          }
        }
        continue;
      }

      // 'where' clauses:
      if (
        this._plan._criteria &&
        !Object.keys(this._plan._criteria).every(col => {
          if (typeof this._plan._criteria[col] === 'function') {
            return this._plan._criteria[col](row[col]);
          } else {
            return this._plan._criteria[col] === row[col];
          }
        })
      ) continue;

      // 'select' clauses:
      results.push(this._plan.selectColumns(row));
    }

    return results;
  }

  count () {
    return this.get().length;
  }

  _copy () {
    const newPlan = Object.assign(new Plan(), this._plan);
    return new FQL(this._table, newPlan);
  }

  limit (lim) {
    const limitQuery = this._copy();
    limitQuery._plan.setLimit(lim);
    return limitQuery;
  }

  select (...columns) {
    const limitQuery = this._copy();
    limitQuery._plan.setSelected(columns);
    return limitQuery;
  }

  where (criteriaObj) {
    const limitQuery = this._copy();
    limitQuery._plan.setCriteria(criteriaObj);
    return limitQuery;
  }

  static merge (...keyValPairs) {
    return Object.assign({}, ...keyValPairs);
  }

  innerJoin (joinedQuery, callback) {
    joinedQuery._plan.setJoinData(this.get(), callback);
    return joinedQuery;

  }
}

module.exports = FQL;
