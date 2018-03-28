
import { update, get } from '../sparql';

export default function PostalAddressExtractor($, id) {
  const address = {
    streetAddress: $('[itemprop=streetAddress]').text().trim(),
    addressLocality: $('[itemprop=addressLocality]').text().trim(),
    addressRegion: $('[itemprop=addressRegion]').text().trim(),
    postalCode: $('[itemprop=postalCode]').text().trim(),
  }
  return new Promise((resolve, reject) => {
    get(`
      BASE <http://medical.o.team/>
      PREFIX schema: <http://schema.org/>
      SELECT
        ?address
      WHERE {
        ?address a schema:PostalAddress.
        ?address schema:streetAddress '${address.streetAddress}'.
        ?address schema:addressLocality '${address.addressLocality}'.
        ?address schema:addressRegion '${address.addressRegion}'.
        ?postalCode schema:postalCode '${address.postalCode}'.
      }
    `)
    .then((result) => {
      if (result.body &&
        result.body.head &&
        result.body.head.results &&
        result.body.head.results.bindings &&
        result.body.head.results.bindings.length > 0
      ) {
        resolve(result.body.head.results.bindings[0].address.value);
      } else {
        update(`
          BASE <http://medical.o.team/>
          PREFIX schema: <http://schema.org/>
          INSERT DATA {
            <PostalAddress-${id}> a schema:PostalAddress;
                                  schema:streetAddress '${address.streetAddress}';
                                  schema:addressLocality '${address.addressLocality}';
                                  schema:addressRegion '${address.addressRegion}';
                                  schema:postalCode '${address.postalCode}'.
          }
        `)
        .then(() => resolve([ `PostalAddress-${id}` ]))
        .catch((err) => reject(err));
      }
    })
    .catch((err) => reject(err))
  });
}