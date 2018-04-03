'use strict';

var scrape = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _scraperjs2.default.StaticScraper.create('' + baseUrl + id).scrape(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($) {
                var data, relationships, query;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!($('h1.ErrorHeader').text() === 'This is a 404 page.')) {
                          _context.next = 2;
                          break;
                        }

                        throw 'Not Found';

                      case 2:
                        _context.next = 4;
                        return _bluebird2.default.props({
                          Physician: (0, _Physician2.default)($, id),
                          CollegeOrUniversity: (0, _CollegeOrUniversity2.default)($, id),
                          HealthInsurancePlan: (0, _HealthInsurancePlan2.default)($, id),
                          MedicalSpecialty: (0, _MedicalSpecialty2.default)($, id),
                          Person: (0, _Person2.default)($, id),
                          PostalAddress: (0, _PostalAddress2.default)($, id),
                          Review: (0, _Review2.default)($, id)
                        }).catch(function (err) {
                          console.log(err);
                        });

                      case 4:
                        data = _context.sent;
                        relationships = {
                          Physician: {
                            'schema:address': 'PostalAddress',
                            'schema:founder': 'Person',
                            'schema:review': 'Review',
                            'schema:medicalSpecialty': 'MedicalSpecialty',
                            'schema:healthPlanNetwork': 'HealthInsurancePlan'
                          },
                          CollegeOrUniversity: {
                            'schema:alumni': 'Person'
                          },
                          HealthInsurancePlan: {},
                          MedicalSpecialty: {},
                          Person: {
                            'schema:alumniOf': 'CollegeOrUniversity',
                            'schema:worksFor': 'Physician'
                          },
                          PostalAddress: {},
                          Review: {}
                        };
                        query = 'BASE <http://medical.o.team/> PREFIX schema: <http://schema.org/> INSERT DATA { ';


                        Object.keys(data).forEach(function (key) {
                          data[key].forEach(function (subject) {
                            if (Object.keys(relationships[key]).length > 0) {
                              query += '<' + subject + '> ';
                              Object.keys(relationships[key]).forEach(function (relKey) {
                                data[relationships[key][relKey]].forEach(function (directObject) {
                                  query += relKey + ' <' + directObject + '>; ';
                                });
                              });
                              query = query.slice(0, -1) + '. ';
                            }
                          });
                        });
                        query += '}';

                        (0, _sparql.update)(query).then(function (result) {
                          console.log('Successfully Saved ' + id);
                        }).catch(function (err) {
                          console.log(err);
                        });

                      case 10:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }()).catch(function () {
              return console.log(id + ' was not found.');
            });

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function scrape(_x) {
    return _ref.apply(this, arguments);
  };
}();

// scrape(199678);

var _scraperjs = require('scraperjs');

var _scraperjs2 = _interopRequireDefault(_scraperjs);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _nodeGeocoder = require('node-geocoder');

var _nodeGeocoder2 = _interopRequireDefault(_nodeGeocoder);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Physician = require('./extractors/Physician.extractor');

var _Physician2 = _interopRequireDefault(_Physician);

var _CollegeOrUniversity = require('./extractors/CollegeOrUniversity.extractor');

var _CollegeOrUniversity2 = _interopRequireDefault(_CollegeOrUniversity);

var _HealthInsurancePlan = require('./extractors/HealthInsurancePlan.extractor');

var _HealthInsurancePlan2 = _interopRequireDefault(_HealthInsurancePlan);

var _MedicalSpecialty = require('./extractors/MedicalSpecialty.extractor');

var _MedicalSpecialty2 = _interopRequireDefault(_MedicalSpecialty);

var _Person = require('./extractors/Person.extractor');

var _Person2 = _interopRequireDefault(_Person);

var _Review = require('./extractors/Review.extractor');

var _Review2 = _interopRequireDefault(_Review);

var _PostalAddress = require('./extractors/PostalAddress.extractor');

var _PostalAddress2 = _interopRequireDefault(_PostalAddress);

var _sparql = require('./sparql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var geocoder = (0, _nodeGeocoder2.default)({
  provider: 'google',
  apiKey: 'AIzaSyDfaBUcdpVjgtgUaRMD-wQKMiIXWqFB4HU'
});

var baseUrl = 'https://www.zocdoc.com/doctor/';

var BEGIN = 201;
var END = 400;
var DELAY = 1000;

console.log('beginning');

var _loop = function _loop(i) {
  setTimeout(function () {
    return scrape(i);
  }, DELAY * (i - BEGIN));
};

for (var i = BEGIN; i <= END; i++) {
  _loop(i);
}