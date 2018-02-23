import scraper from 'scraperjs';

const testUrl = 'https://www.zocdoc.com/primary-care-doctors/atlanta-218712pm?dr_specialty=153&address=Atlanta%2C+GA&reason_visit=75&insurance_carrier=-1&insurance_plan=-1&gender=-1&language=-1&patienttypechild=&offset=0&referrertype=&sort_selection=0&name=&searchquery=&searchqueryguid=ed0e277b-ca2c-445f-9c08-3fadc5b50d8f&hasnosearchresults=false&hospitalid=-1&timefilter=AnyTime&dayfilter=0&procedurechanged=false&languagechanged=false&&isfromajax=true';

const tree = {};

const generateTree = (element) => {
  if (element.type === 'tag') {
    return {
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