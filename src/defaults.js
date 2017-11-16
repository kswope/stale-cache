
import lscache from 'lscache'
import objectHash from 'object-hash'


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// You can override everything here with :
//
// import { staleCacheConfig } from 'stale-cache'
// staleCache = staleCacheConfig( { mkRequestHash: myMkRequestHash } )
//
// instead of
//
// import { staleCache } from 'stale-cache'
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Takes the relevant values from config ( like url, data, params, etc ) and
// makes a unique key for local storage so we can look it up again given the
// same config. This default is for axios.  Something else might have different
// keys for things like 'params'.  Must be a value that can be used as key so
// if its data structure, make sure its JSON'd.  At first this was JSON, but
// getting determinent JSON string from an object has issues because sort order
// is not guaranteed, so I switched to object-hash, which seems to tackle that
// problem itself.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function mkRequestHash( config ) {

  const picked = {
    url: config[ "url" ],
    method: config[ "method" ],
    data: config[ "data" ],
    params: config[ "params" ],
  }

  return objectHash( picked )

}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Replace with whatever storage library you want.  lscache is good because it
// checks for localstorage full exceptions and deletes old records.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function storageGet(...args){
  return lscache.get(...args)
}

export function storageSet(...args){
  return lscache.set(...args)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Return part of the response goes into storage.  Also opportunity to use
// compression if we choose.  This is mostly just an axios wrapper, because
// axios puts its JSON data in response.data, rather than something like
// response.body
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function cacheIn( response ) {
  return response.data
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// How cached data attaches to 'response', see cacheIn() above
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function cacheOut( response, data ) {
  // key with 'data' to make it look like a real axios response
  response.data = data
  return response
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add response version to request. DO NOT MODIFY PASSED IN REQUEST (DUMBASS)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function insertResponseVersion( request, token ) {
  let request2 = {...request, data: { responseVersion: token, ...request.data } }
  return request2
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Extract cache token from response.  Might not exist.  Its not necessary to
// remove it from response, but we do here.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function extractResponseVersion( response ) {
  const token = response.data.responseVersion
  delete response.data.responseVersion
  return [ token, response ]
}


