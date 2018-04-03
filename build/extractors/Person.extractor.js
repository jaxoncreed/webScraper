'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PersonExtractor;

var _parseFullName = require('parse-full-name');

var _sparql = require('../sparql');

function PersonExtractor($, id) {
  var name = (0, _parseFullName.parseFullName)($('[itemprop=name]').text().trim());
  return new Promise(function (resolve, reject) {
    (0, _sparql.update)('\n      BASE <http://medical.o.team/>\n      PREFIX schema: <http://schema.org/>\n      INSERT DATA {\n        <Person-' + id + '> a schema:Person;\n                       schema:givenName \'' + name.first + '\';\n                       schema:familyName \'' + name.last + '\'.\n      }\n    ').then(function () {
      return resolve(['Person-' + id]);
    }).catch(function (err) {
      return reject(err);
    });
  });
}