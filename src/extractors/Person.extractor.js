import { parseFullName } from 'parse-full-name';
import { update } from '../sparql';

export default function PersonExtractor($, id, db) {
  const name = parseFullName($('[itemprop=name]').text().trim());
  return new Promise((resolve, reject) => {

    db.add(`<Person-${id}>`, `a`, `schema:Person`);
    db.add(`<Person-${id}>`, `schema:givenName`, `"${name.first}"`);
    db.add(`<Person-${id}>`, `schema:familyName`, `"${name.last}"`);
    resolve([ `<Person-${id}>` ]);
  });
}