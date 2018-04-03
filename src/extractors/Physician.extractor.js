import { parseFullName } from 'parse-full-name';
import { update } from '../sparql';

export default function PhysicianExtractor($, id, db) {
  const name = parseFullName($('[itemprop=name]').text().trim());
  return new Promise((resolve, reject) => {
    db.add(`<Physician-${id}>`, `a`, `schema:Physician`);
    resolve([ `<Physician-${id}>` ]);
  });
}