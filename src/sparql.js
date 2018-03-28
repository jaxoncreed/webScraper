import request from 'superagent';

const sparqlEndpoint = 'http://159.203.177.89:8080/blazegraph/sparql'

export function update(query) {
  return request.post(`${sparqlEndpoint}?update=${query}`).set('Accept', 'application/json');
}

export function get(query) {
  return request.post(`${sparqlEndpoint}?query=${query}`).set('Accept', 'application/json');
}