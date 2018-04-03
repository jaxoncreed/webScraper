'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PhysicianExtractor;

var _parseFullName = require('parse-full-name');

var _sparql = require('../sparql');

function PhysicianExtractor($, id) {
  var name = (0, _parseFullName.parseFullName)($('[itemprop=name]').text().trim());
  return new Promise(function (resolve, reject) {
    (0, _sparql.update)('\n      BASE <http://medical.o.team/>\n      PREFIX schema: <http://schema.org/>\n      INSERT DATA {\n        <Physician-' + id + '> a schema:Physician.\n      }\n    ').then(function () {
      return resolve(['Physician-' + id]);
    }).catch(function (err) {
      return reject(err);
    });
  });
}