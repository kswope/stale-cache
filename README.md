# stale-cache

### Purpose

Wrapper for promise based ajax libraries like fetch, axios, and vue-resource
that automatically caches to localstorage.

### Install
```bash
npm install stale-cache
```

### Scenario

Instead of this
```
response = await axios( { url: '/user', params: {ID: 12345} } )
displayData( response )
```

use this
```
response = await staleCache( { url: '/user', params: {ID: 12345} } )
displayData( response )

response = await response.fresh()
displayData( response )
```

### Heavy lifting provided by

[lscache](https://github.com/pamelafox/lscache) - A localStorage-based memcache-inspired client-side caching library.

[object-hash](https://github.com/puleos/object-hash) - Generate hashes from javascript objects in node and the browser.

### Complete scenario
```
import { staleCacheConfig } from 'stale-cache'                                                                                                        
import axios from 'axios'                                                                                                                           
const staleCache = staleCacheConfig( { execute: req => axios( req ) } )

// your query to your API endpoint, this will be munged to become the 
// lookup key in localstorage, so it must be unique
const request = { url: "http://localhost/user/1", method: "POST" }

///////////////////////////////////////////////////////
// old-fashioned "then" version your grandpa might use
///////////////////////////////////////////////////////

staleCache( request )
  .then( response => {
    // this is the attempted localstorage cache hit
    if ( response.data ) {
      displayData( response )
    }
    // this is how you make the actual ajax request, must be returned from then!
    return response.fresh() 
  } )
  .then( response => {
    // response is now the live data
    displayData( response )
  } )
  .catch( err => {
    console.error( err )
  } )

/////////////////////////////////////////////////////
// cool async/await version ( inside async function )
/////////////////////////////////////////////////////

try {

  response = await staleCache( request )

  if ( response.data ) {
    displayData( response )
  }

  response = await response.fresh()
  displayData( response )

} catch ( err ) {

  console.error( err )

}
```

## Server Saver Mode

stale-cache, in default mode, will first try to return the locally cached data
and then **always** download the fresh data.  But what if the data hasn't changed, why are
you downloading it again?

stale-cache can ask the server if the data has changed, and if the server says
it hasn't, it will look to its cache, even for fresh()

In response to a request, **if** the server returns a "responseVersion" token, stale-cache
stores that along with the request data.

When the same request is made, stale-cache automatically sends back the "responseVersion"
token and then the server has two choices - return new data along with a new token,
or respond with simply "OK" in the "responseVersion" field.

When/If the stale-cache sees this OK, it will return the cached
results from the fresh() call.  This means your server only has to return "OK",
saving a lot of bandwidth, and hopefully other resources too since it was smart
enough not to run the same database query.

### Overriding defaults

Along with the required execute() passed to staleCacheConfig everything in src/defaults.js can be overridden.

* mkRequestHash: determines what in the http request gets made into a hash.  Default uses object-hash.
* storageGet: how local data is retrieved from storage.  Default uses lscache.  Could be memory instead.
* storageSet:  how local data is stored.  Defaults to lscache.  Could be memory instead.
* cacheIn: What in the response gets stored.
* cacheOut: how to present data in object returned from storage.
* insertResponseVersion: where to put the token for caching.
* extractResponseVersion:  extract caching token from response.
















