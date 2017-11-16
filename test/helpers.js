
import axios from 'axios'
import sinon from 'sinon'
import utils from 'util'



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// better logging of deep data structures
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function loggit( arg ) {
  console.log( utils.inspect( arg ) )
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// sinon fakeServer respondWith with happy response defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function mkFakeServer() {
  const server = sinon.fakeServer.create();
  server.respondImmediately = true;
  server.happyResponse = function( method, path, data ) {
    this.respondWith( method, path, [ 200, {
      "Content-Type": "application/json"
    }, JSON.stringify( data ) ] );
  }
  return server
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add a request interceptor for debugging
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
axios.interceptors.request.use( function( config ) {
  // console.warn( "axios request", config )
  return config;
}, function( error ) {
  return Promise.reject( error );
} );


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add an axios response interceptor for debugging
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
axios.interceptors.response.use( function( response ) {
  // console.warn("axios response", response)
  return response;
}, function( error ) {
  return Promise.reject( error );
} );

