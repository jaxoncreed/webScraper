'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PostalAddressExtractor;

var _sparql = require('../sparql');

function PostalAddressExtractor($, id) {
  var address = {
    streetAddress: $('[itemprop=streetAddress]').text().trim(),
    addressLocality: $('[itemprop=addressLocality]').text().trim(),
    addressRegion: $('[itemprop=addressRegion]').text().trim(),
    postalCode: $('[itemprop=postalCode]').text().trim()
  };
  return new Promise(function (resolve, reject) {
    (0, _sparql.get)('\n      BASE <http://medical.o.team/>\n      PREFIX schema: <http://schema.org/>\n      SELECT\n        ?address\n      WHERE {\n        ?address a schema:PostalAddress.\n        ?address schema:streetAddress \'' + address.streetAddress + '\'.\n        ?address schema:addressLocality \'' + address.addressLocality + '\'.\n        ?address schema:addressRegion \'' + address.addressRegion + '\'.\n        ?postalCode schema:postalCode \'' + address.postalCode + '\'.\n      }\n    ').then(function (result) {
      if (result.body && result.body.head && result.body.head.results && result.body.head.results.bindings && result.body.head.results.bindings.length > 0) {
        resolve(result.body.head.results.bindings[0].address.value);
      } else {
        (0, _sparql.update)('\n          BASE <http://medical.o.team/>\n          PREFIX schema: <http://schema.org/>\n          INSERT DATA {\n            <PostalAddress-' + id + '> a schema:PostalAddress;\n                                  schema:streetAddress \'' + address.streetAddress + '\';\n                                  schema:addressLocality \'' + address.addressLocality + '\';\n                                  schema:addressRegion \'' + address.addressRegion + '\';\n                                  schema:postalCode \'' + address.postalCode + '\'.\n          }\n        ').then(function () {
          return resolve(['PostalAddress-' + id]);
        }).catch(function (err) {
          return reject(err);
        });
      }
    }).catch(function (err) {
      return reject(err);
    });
  });
}