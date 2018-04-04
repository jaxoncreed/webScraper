import request from 'superagent'
import Promise from 'bluebird';
import shortId from 'shortid';

import { update, get } from '../sparql';

const collection = {};
export default function CollegeOrUniversityExtractor($, id, db) {
  return new Promise(async (resolve, reject) => {

    const names = $(`.sg-title:contains('Education')`).parent().parent().find(`li`).map(function() {
      return $(this).text().trim();
    }).get().filter(name => name.indexOf('Medical School') !== -1).map(name => name.replace('Medical School - ', '').split(',')[0]);

    let subjects = await Promise.map(names, async (name) => {

      if (collection[name]) {
        return collection[name];
      }
      const result = await get(`
        BASE <http://medical.o.team/>
        PREFIX schema: <http://schema.org/>
        SELECT
          ?college
        WHERE {
          ?college a schema:CollegeOrUniversity.
          ?college schema:name '${name}'.
        }
      `);

      if (result.body &&
        result.body.head &&
        result.body.head.results &&
        result.body.head.results.bindings &&
        result.body.head.results.bindings.length > 0
      ) {
        collection[name] = result.body.head.results.bindings[0].college.value;
        return [ `<${result.body.head.results.bindings[0].college.value}>` ];
      } else {
        const newId = shortId.generate();
        collection[name] = `<CollegeOrUniversity-${newId}>`;
        db.add(`<CollegeOrUniversity-${newId}>`, `a`, `schema:CollegeOrUniversity`);
        db.add(`<CollegeOrUniversity-${newId}>`, `schema:name`, `"${name}"`);
        return `<CollegeOrUniversity-${newId}>`;
      }
    })
    .catch((err) => reject(err));
    resolve(subjects);

  });
}