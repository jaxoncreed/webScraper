import scraper from 'scraperjs';

const testUrl = 'https://www.zocdoc.com/primary-care-doctors/atlanta-218712pm?dr_specialty=153&address=Atlanta%2C+GA&reason_visit=75&insurance_carrier=-1&insurance_plan=-1&gender=-1&language=-1&patienttypechild=&offset=0&referrertype=&sort_selection=0&name=&searchquery=&searchqueryguid=ed0e277b-ca2c-445f-9c08-3fadc5b50d8f&hasnosearchresults=false&hospitalid=-1&timefilter=AnyTime&dayfilter=0&procedurechanged=false&languagechanged=false&&isfromajax=true';

const tree = {};

const tagHuristic = (tag) => {

}

const textHursitic = (text) => {

}

const generateTree = (element) => {
  if (element.type === 'tag') {
    const  {
      type: element.type,
      name: element.name,
      attribs: element.attribs,
      children: element.children.map((child) => generateTree(child))
    }
  } else if (element.type === 'text') {
    return {
      type: element.type,
      data: element.data
    }
  } else if (element.type === 'script') {
    // Do nothing. Scripts are not supported
  } else if (element.type === 'comment') {
    // Do nothing. Comments are not supported
  } else {
    console.log(`This is an unhandled type: ${element.type}`);
  }

}

console.log('beginning');
scraper.StaticScraper.create(testUrl).scrape(($) => {
  const body = $('body');
  console.log('response received');
  // console.log(JSON.stringify(generateTree(body[0]), null, 2));
  generateTree(body[0]);
  console.log('done');

});





// OTHER STUFF

import scraper from 'scraperjs';
import request from 'superagent';
import NodeGeocoder from 'node-geocoder';
import Promise from 'bluebird';

import Physician from './extractors/Physician.extractor';
import CollegeOrUniversity from './extractors/CollegeOrUniversity.extractor';
import HealthInsurancePlan from './extractors/HealthInsurancePlan.extractor';
import MedicalSpecialty from './extractors/MedicalSpecialty.extractor';
import Person from './extractors/Person.extractor';
import Rating from './extractors/Rating.extractor';
import PostalAddress from './extractors/PostalAddress.extractor';

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: 'AIzaSyDfaBUcdpVjgtgUaRMD-wQKMiIXWqFB4HU'
});

const baseUrl = 'https://www.zocdoc.com/doctor/';
const sparqlEndpoint = 'http://159.203.177.89:8080/blazegraph/sparql'

const BEGIN = 0;
const END = 100000;
const DELAY = 100;

console.log('beginning');


const collections = {};
const getCollection = (collectionName, itemName) => {
  if (!collectionName || !itemName) {
    return null;
  }
  if (!collections[collectionName]) {
    collections[collectionName] = {}
  }
  if (!collections[collectionName][itemName]) {
    collections[collectionName][itemName] = `https://o.team/${collectionName}/${Object.keys(collections[collectionName]).length}`
    const query = `
      PREFIX schema: <http://schema.org/>
      INSERT DATA { <${collections[collectionName][itemName]}> schema:name "${itemName}". }`;
    request.post(`${sparqlEndpoint}?update=${query}`).then((result) => {
      console.log(`Added ${collectionName} ${itemName}`)
    }).catch((error) => {
      console.log(error);
    });
  }
  return collections[collectionName][itemName];
}

const urlExpression = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

async function scrape(id) {
  scraper.StaticScraper.create(`${baseUrl}${id}`).scrape(async ($) => {
    if ($('h1.ErrorHeader').text() === 'This is a 404 page.') {
      throw 'Not Found';
    }


    const data = await Promise.props({
      Physician: Physician($),
      CollegeOrUniversity: CollegeOrUniversity($),
      HealthInsurancePlan: HealthInsurancePlan($),
      MedicalSpecialty: MedicalSpecialty($),
      Person: Person($),
      PostalAddress: PostalAddress($),
      Rating: Rating($)
    }).catch((err) => {
      console.log(err);
    });


    console.log(data);

    // const data = {
    //   Physician: {

    //   },
    //   Address: {

    //   },
    //   Person: {

    //   },
    //   CollegeOrUniversity: {

    //   },
    //   HealthInsurancePlan: {

    //   },
    //   Specialty
    //   id: id.toString(),
    //   name: $('[itemprop=name]').text().trim(),
    //   streetAddress: $('[itemprop=streetAddress]').text().trim(),
    //   addressLocality: $('[itemprop=addressLocality]').text().trim(),
    //   addressRegion: $('[itemprop=addressRegion]').text().trim(),
    //   postalCode: $('[itemprop=postalCode]').text().trim(),
    //   // education: $('p.sg-title:contains(Education)').parent().next().find('li').map(() => $(this).text().trim()).get()
    // };

    // Calculate Rating:
    // const rating = $('[itemprop=reviewRating]').map(() => {
    //   return $(this).children();
    // }).get()


    return data;
  })
  // .then((data) => {
  //   const requests = [
  //     request.get(`https://www.zocdoc.com/insuranceinformation/ProfessionalInsurances?id=${data.id}`).catch((err) => {
  //       try {
  //         return JSON.parse(err.rawResponse.substring(8));
  //       } catch (e) {
  //         return null;
  //       }
  //     }).then(({ Carriers }) => {
  //       return {
  //         insuranceAgency: Carriers.map((carrier) => getCollection('insuranceAgency', carrier.Name))
  //       }
  //     })
  //   ];
  //   // if (data.streetAddress) {
  //   //   requests.push(geocoder.geocode(`${data.streetAddress} ${data.postalCode}`)).then((addressInfo) => {
  //   //     addressInfo = addressInfo[0];
  //   //     return {
  //   //       streetAddress: addressInfo.formattedAddress,
  //   //       latitude: addressInfo.latitude,
  //   //       longitude: addressInfo.longitude,
  //   //       city: addressInfo.city,
  //   //     }
  //   //   })
  //   // }
  //   return Promise.all(requests).then((vals) => {
  //     return Object.assign(data, ...vals);
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  // })
  // .then((dataPromise) => {
  //   dataPromise.then((data) => {
  //     if (data.name) {
  //       let rows = '';
  //       Object.keys(data).forEach((dataKey) => {
  //         if (data[dataKey] != null) {
  //           let dataVals = Array.isArray(data[dataKey]) ? data[dataKey] : [ data[dataKey] ];
  //           dataVals.forEach((dataVal) => {
  //             dataVal = (dataVal.match(urlExpression)) ? `<${dataVal}>` : `"${dataVal}"`;
  //             rows += ` schema:${dataKey} ${dataVal};`
  //           });
  //         }
  //       });
  //       rows = rows.slice(0, -1) + '.';
  //       const query = `
  //         BASE <http://medical.o.team/>
  //         PREFIX schema: <http://schema.org/>
  //         INSERT DATA
  //         {
  //           <${baseUrl}${id}> ${rows}
  //         }
  //       `;
  //       request.post(`${sparqlEndpoint}?update=${query}`).then((result) => {
  //         console.log(`Successfully update ${data.id}`)
  //       }).catch((error) => {
  //         console.log(error);
  //       });
  //     }
  //   });
  // })
  // // .catch((err) => console.log(err))
  // .catch(() => console.log(`${id} was not found.`))
}


scrape(199678);

// for (let i = BEGIN; i <= END; i ++) {
//   setTimeout(() => scrape(i), DELAY * i);
// }
