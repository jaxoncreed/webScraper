'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HealthInsurancePlanExtractor;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _sparql = require('../sparql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var collection = {};
function HealthInsurancePlanExtractor($, id) {
  var _this = this;

  return new _bluebird2.default(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var names, subjects;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _superagent2.default.get('https://www.zocdoc.com/insuranceinformation/ProfessionalInsurances?id=' + id).catch(function (err) {
                try {
                  return JSON.parse(err.rawResponse.substring(8));
                } catch (e) {
                  return null;
                }
              }).then(function (_ref2) {
                var Carriers = _ref2.Carriers;

                return Carriers.map(function (carrier) {
                  return carrier.Name;
                });
              });

            case 2:
              names = _context2.sent;
              _context2.next = 5;
              return _bluebird2.default.map(names, function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
                  var result, newId;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!collection[name]) {
                            _context.next = 2;
                            break;
                          }

                          return _context.abrupt('return', collection[name]);

                        case 2:
                          _context.next = 4;
                          return (0, _sparql.get)('\n        BASE <http://medical.o.team/>\n        PREFIX schema: <http://schema.org/>\n        SELECT\n          ?plan\n        WHERE {\n          ?plan a schema:HealthInsurancePlan.\n          ?plan schema:name \'' + name + '\'.\n        }\n      ');

                        case 4:
                          result = _context.sent;

                          if (!(result.body && result.body.head && result.body.head.results && result.body.head.results.bindings && result.body.head.results.bindings.length > 0)) {
                            _context.next = 10;
                            break;
                          }

                          collection[name] = result.body.head.results.bindings[0].address.value;
                          return _context.abrupt('return', result.body.head.results.bindings[0].address.value);

                        case 10:
                          newId = _shortid2.default.generate();
                          _context.next = 13;
                          return (0, _sparql.update)('\n          BASE <http://medical.o.team/>\n          PREFIX schema: <http://schema.org/>\n          INSERT DATA {\n            <HealthInsurancePlan-' + newId + '> a schema:HealthInsurancePlan;\n                                            schema:name \'' + name + '\'.\n          }\n        ');

                        case 13:
                          return _context.abrupt('return', 'HealthInsurancePlan-' + newId);

                        case 14:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }()).catch(function (err) {
                return reject(err);
              });

            case 5:
              subjects = _context2.sent;


              resolve(subjects);

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}