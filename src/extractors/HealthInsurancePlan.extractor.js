import request from 'superagent'
import Promise from 'bluebird';
import shortId from 'shortid';

import { update, get } from '../sparql';

const collection = {};
export default function HealthInsurancePlanExtractor($, id) {
  return new Promise(async (resolve, reject) => {
    const names = await request.get(`https://www.zocdoc.com/insuranceinformation/ProfessionalInsurances?id=${id}`).catch((err) => {
      try {
        return JSON.parse(err.rawResponse.substring(8));
      } catch (e) {
        return null;
      }
    }).then(({ Carriers }) => {
      return Carriers.map(carrier => carrier.Name);
    });

    let subjects = await Promise.map(names, async (name) => {
      if (collection[name]) {
        return collection[name];
      }
      const result = await get(`
        BASE <http://medical.o.team/>
        PREFIX schema: <http://schema.org/>
        SELECT
          ?plan
        WHERE {
          ?plan a schema:HealthInsurancePlan.
          ?plan schema:name '${name}'.
        }
      `);

      if (result.body &&
        result.body.head &&
        result.body.head.results &&
        result.body.head.results.bindings &&
        result.body.head.results.bindings.length > 0
      ) {
        collection[name] = result.body.head.results.bindings[0].address.value;
        return result.body.head.results.bindings[0].address.value;
      } else {
        const newId = shortId.generate();
        await update(`
          BASE <http://medical.o.team/>
          PREFIX schema: <http://schema.org/>
          INSERT DATA {
            <HealthInsurancePlan-${newId}> a schema:HealthInsurancePlan;
                                            schema:name '${name}'.
          }
        `)
        return `HealthInsurancePlan-${newId}`;
      }
    }).catch((err) => reject(err));

    resolve(subjects);

  });
}