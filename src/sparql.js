import request from 'superagent';

const sparqlEndpoint = 'http://159.203.177.89:8080/fuseki/o'

export function update(query) {
  return request.post(`${sparqlEndpoint}/update`)
    .set('Accept', 'application/sparql-results+json,*/*;q=0.9')
    .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    .send(`update=${query}`);
}

export function get(query) {
  return request.post(`${sparqlEndpoint}/query`)
    .set('Accept', 'application/sparql-results+json,*/*;q=0.9')
    .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    .send(`query=${query}`);
}