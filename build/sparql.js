'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;
exports.get = get;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sparqlEndpoint = 'http://159.203.177.89:8080/fuseki/o';

function update(query) {
  return _superagent2.default.post(sparqlEndpoint + '/update').set('Accept', 'application/sparql-results+json,*/*;q=0.9').set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').send('update=' + query);
}

function get(query) {
  return _superagent2.default.post(sparqlEndpoint + '/query').set('Accept', 'application/sparql-results+json,*/*;q=0.9').set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').send('query=' + query);
}