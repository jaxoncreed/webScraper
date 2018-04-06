import shortId from 'shortid';
import Promise from 'bluebird';
import { parseFullName } from 'parse-full-name';

export default function RatingExtractor($, id, db) {
  return new Promise((resolve) => {
    const ratings = $('[itemprop=reviews]').map(function() {
      return {
        rating: $(this).find('[itemprop=ratingValue]').attr('content'),
        text: $(this).find('[itemprop=reviewBody]').text().replace(/\r?\n?/g, '').replace(new RegExp('"', 'g'), '\\"').trim(),
        author: parseFullName($(this).find('[itemprop=author]').text().substring(3))
      }
    }).get();

    if (ratings.length > 0) {
      db.add(`<Physician-${id}>`, `schema:aggregateRating`, ratings.reduce((agg, rating) => agg + parseFloat(rating.rating), 0) / ratings.length);
    }

    const ratingUrls = [];
    ratings.forEach((rating) => {
      const ratingId = shortId.generate();
      ratingUrls.push(`<Review-${ratingId}>`);

      db.add(`<Review-${ratingId}>`, `a`, `schema:Review`);
      db.add(`<Person-${ratingId}>`, `a`, `schema:Person`);
      db.add(`<Rating-${ratingId}>`, `a`, `schema:Rating`);

      db.add(`<Review-${ratingId}>`, `schema:author`, `<Person-${ratingId}>`);
      db.add(`<Review-${ratingId}>`, `schema:reviewBody`, `"${rating.text}"`);
      db.add(`<Review-${ratingId}>`, `schema:reviewRating`, `<Rating-${ratingId}>`);

      db.add(`<Person-${ratingId}>`, `schema:givenName`, `"${rating.author.first}"`);
      db.add(`<Person-${ratingId}>`, `schema:familyName`, `"${rating.author.last}"`);

      db.add(`<Rating-${ratingId}>`, `schema:author`, `<Person-${ratingId}>`);
      db.add(`<Rating-${ratingId}>`, `schema:bestRating`, `5`);
      db.add(`<Rating-${ratingId}>`, `schema:worstRating`, `1`);
      db.add(`<Rating-${ratingId}>`, `schema:ratingValue`, `${rating.rating}`);
    });
    resolve(ratingUrls);

  });
}