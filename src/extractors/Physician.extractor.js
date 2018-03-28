import { parseFullName } from 'parse-full-name';
import { update } from '../sparql';

export default function PhysicianExtractor($, id) {
  const name = parseFullName($('[itemprop=name]').text().trim());
  return new Promise((resolve, reject) => {
    update(`
      BASE <http://medical.o.team/>
      PREFIX schema: <http://schema.org/>
      INSERT DATA {
        <Physician-${id}> a schema:Physician.
      }
    `)
    .then(() => resolve([ `Physician-${id}` ]))
    .catch((err) => reject(err));
  });
}