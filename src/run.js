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

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: 'AIzaSyDfaBUcdpVjgtgUaRMD-wQKMiIXWqFB4HU'
});

const baseUrl = 'https://www.zocdoc.com/doctor/';


const BEGIN = 0;
const END = 100000;
const DELAY = 1000;

console.log('beginning');

async function scrape(id) {
  scraper.StaticScraper.create(`${baseUrl}${id}`).scrape(async ($) => {
    if ($('h1.ErrorHeader').text() === 'This is a 404 page.') {
      throw 'Not Found';
    }


    const data = await Promise.props({
      Physician: Physician($, id),
      CollegeOrUniversity: CollegeOrUniversity($, id),
      HealthInsurancePlan: HealthInsurancePlan($, id),
      MedicalSpecialty: MedicalSpecialty($, id),
      Person: Person($, id),
      PostalAddress: PostalAddress($, id),
      Review: Review($, id)
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


    let query = 'BASE <http://medical.o.team/> PREFIX schema: <http://schema.org/> INSERT DATA { ';

    Object.keys(data).forEach((key) => {
      data[key].forEach((subject) => {
        if (Object.keys(relationships[key]).length > 0) {
          query += `<${subject}> `
          Object.keys(relationships[key]).forEach((relKey) => {
            data[relationships[key][relKey]].forEach((directObject) => {
              query += `${relKey} <${directObject}>; `
            });
          })
          query = query.slice(0, -1) + '. ';
        }
      });
    });
    query += '}'

    update(query).then((result) => {
      console.log(`Successfully Saved ${id}`);
    })
    .catch((err) => {
      console.log(err);
    })

  })
  .catch(() => console.log(`${id} was not found.`))
}


// scrape(199678);

for (let i = BEGIN; i <= END; i ++) {
  setTimeout(() => scrape(i), DELAY * i);
}
