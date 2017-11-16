import * as defaults from "./defaults"

function mkResponseVersionKey( str ) {
  return 'response-version-' + str
}

// returns staleCache() which has been configured by arguments 
export function staleCacheConfig( config = {} ) {

  config = {...defaults, ...config }

  // this is staleCache() itself!
  return function( requestConfig ) {

    const requestHash = config.mkRequestHash( requestConfig )

    // this will be the object, later wrapped in promise, returned from
    // staleCache(request)
    let dummyResponse = {}

    // maybe find results in localstorage from previous ajax request
    dummyResponse = 
      config.cacheOut( dummyResponse, config.storageGet( requestHash ) )

    dummyResponse.fresh = function() {

      // add response version to request if we have one in localstorage
      {
        let version = config.storageGet( mkResponseVersionKey( requestHash ) )
        if ( version ) {
          requestConfig = config.insertResponseVersion( requestConfig, version )
        }
      }

      return config.execute( requestConfig ).then( res => {

        // try to extract version
        let [ version, response ] = config.extractResponseVersion( res )

        if ( version && version.toUpperCase && version.toUpperCase() === "OK" ) { // we already have latest data

           return dummyResponse

        } else { 

          // cache response
          config.storageSet( requestHash, config.cacheIn( response ) )

          // Server may have given us a version. Store version along with
          // requestHash so we can send them together in future requests, and
          // maybe we'll end up in the (version===ok) clause above next time
          if ( version ) {
            config.storageSet( mkResponseVersionKey( requestHash ), version )
          }

          return response

        }

      } )

    }

    // The 'response' immediately returned from staleCache(requestConfig), has
    // fresh() method.  Doesn't need to be a promise because the data in
    // dummyResponse was probably obtained syncly (localstorage), but we return
    // a promise to make the API consistent.
    return Promise.resolve( dummyResponse )

  }

}
