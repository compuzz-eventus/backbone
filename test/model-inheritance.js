// Quick Backbone Node-runtime tests to make sure ES6 `class extends`
// inheritance works correctly against Backbone.Model's function
// constructor (super() and the prototype chain hand off properly).

'use strict';

const {ok: oldOk} = require('assert');
const {Model} = require('../backbone');

let count = 0;
const ok = (...args) => {
  oldOk(...args);
  count++;
};

class Document extends Model {
  fullName() {
    return this.get('name') + ' ' + this.get('surname');
  }
}

const tempest = new Document({
  id: '1-the-tempest',
  title: 'The Tempest',
  name: 'William',
  surname: 'Shakespeare',
  length: 123
});

ok(tempest.fullName() === 'William Shakespeare');
ok(tempest.get('length') === 123);


class ProperDocument extends Document {
  fullName() {
    return 'Mr. ' + super.fullName(...arguments);
  }
}

const properTempest = new ProperDocument(tempest.attributes);

ok(properTempest.fullName() === 'Mr. William Shakespeare');
ok(properTempest.get('length') === 123);


// eslint-disable-next-line no-console
console.log(`passed ${count} tests`);
