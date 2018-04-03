import scraper from 'scraperjs';
import request from 'superagent';
import NodeGeocoder from 'node-geocoder';
import Promise from 'bluebird';

import Physician from './extractors/Physician.extractor';
import CollegeOrUniversity from './extractors/CollegeOrUniversity.extractor';
import HealthInsurancePlan from './extractors/HealthInsurancePlan.extractor';
import MedicalSpecialty from './extractors/MedicalSpecialty.extractor';
import Person from './extractors/Person.extractor';
import Review from './extractors/Review.extractor';
import PostalAddress from './extractors/PostalAddress.extractor';
import { update } from './sparql';
import DB from './db.js';

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: 'AIzaSyDfaBUcdpVjgtgUaRMD-wQKMiIXWqFB4HU'
});

const baseUrl = 'https://www.zocdoc.com/doctor/';


const BEGIN = 201;
const END = 400;
const DELAY = 1000;

console.log('beginning');

async function scrape(id, db) {
  scraper.StaticScraper.create(`${baseUrl}${id}`).scrape(async ($) => {
    if ($('h1.ErrorHeader').text() === 'This is a 404 page.') {
      console.log(`${id} not found.`)
      return;
    }


    const data = await Promise.props({
      Physician: Physician($, id, db),
      CollegeOrUniversity: CollegeOrUniversity($, id, db),
      HealthInsurancePlan: HealthInsurancePlan($, id, db),
      MedicalSpecialty: MedicalSpecialty($, id, db),
      Person: Person($, id, db),
      PostalAddress: PostalAddress($, id, db),
      Review: Review($, id, db)
    }).catch((err) => {
      console.log(err);
    });

    const relationships = {
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

    Object.keys(data).forEach((key) => {
      data[key].forEach((subject) => {
        if (Object.keys(relationships[key]).length > 0) {
          Object.keys(relationships[key]).forEach((relKey) => {
            data[relationships[key][relKey]].forEach((directObject) => {
              db.add(subject, relKey, directObject)
            });
          })
        }
      });
    });

    console.log(data);
    console.log(db.toString());

  })
  .catch(() => console.log(`${id} was not found.`))
}

const db = new DB();
db.setBase('http://medical.o.team/');
db.addPrefix('schema', 'http://schema.org/');

scrape(199678, db);


// for (let i = BEGIN; i <= END; i ++) {
//   setTimeout(() => scrape(i), DELAY * (i - BEGIN));
// }
