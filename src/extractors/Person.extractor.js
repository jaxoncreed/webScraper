import { parseFullName } from 'parse-full-name';
import { update } from '../sparql';

export default function PersonExtractor($, id) {
  const name = parseFullName($('[itemprop=name]').text().trim());
  return new Promise((resolve, reject) => {
    update(`
      BASE <http://medical.o.team/>
      PREFIX schema: <http://schema.org/>
      INSERT DATA {
        <Person-${id}> a schema:Person;
                       schema:givenName '${name.first}';
                       schema:familyName '${name.last}'.
      }
    `)
    .then(() => resolve([ `Person-${id}` ]))
    .catch((err) => reject(err));
  });
}