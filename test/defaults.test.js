import { mkFakeServer, loggit } from './helpers'
import lscache from 'lscache'
import uuidv1 from 'uuid/v1'

import {
  mkRequestHash,
  storageGet,
  storageSet,
  // execute,
  cacheIn,
  cacheOut,
  insertResponseVersion,
  extractResponseVersion
} from "../src/defaults"

specify( 'mkRequestHash', () => {

  const config = {
    url: "/user/12345",
    method: "post",
    ignore: "me!",
    data: {
      firstName: "Fred",
      lastName: "Flintstone"
    }
  }

  const hash = mkRequestHash( config )

  assert.equal( hash, '9fc4c64d7dd19f73dac7f9f60638fbfe8e37b2d4' )

} )

specify( 'storageGet and storageSet', () => {

  lscache.flush() // storageGet and storageSet are backed by lscache
  let value = uuidv1() // dodge any chance of stale data
  assert( value )
  storageSet( 'key', value )
  assert.equal( value, storageGet( 'key' ) )

} )

// specify.only( 'execute', async() => {
//
//   console.log('execute', execute)
//
//   // execute() uses axios so we need a sinon fake server
//   let server = mkFakeServer()
//   server.happyResponse( "GET", "/nowhere/user/1", { name: "kevin" } )
//   const request = { url: "/nowhere/user/1", method: "GET" }
//
//   // execute is supposed to return a promise resolved with a server response
//   try {
//     let response = await execute( request )
//     assert.deepEqual( response.data, { name: 'kevin' } )
//   } catch ( err ) {
//     assert.fail( null, null, err )
//   }
//
//   // server.restore() // really no idea if I need this
//
// } )

specify( 'cacheIn', () => {

  let value = { x: 1, y: 2, data: 3 }
  let data = cacheIn( value )
  assert.equal( data, 3 )

} )

specify( 'cacheOut', () => {

  let response = {}
  let value = 123
  response = cacheOut( response, value )
  assert.equal( response.data, value )

} )

specify( 'insertResponseVersion', () => {

  let version = 'abc123'

  let request = {}
  request = insertResponseVersion( request, version )
  assert.equal( request.data.responseVersion, version )

  request = { data: { value: 123 } }
  request = insertResponseVersion( request, version )
  assert.equal( request.data.responseVersion, version )

} )

specify( 'extractResponseVersion', () => {

  let response = { data: { value: 123, responseVersion: 'abc123' } }

  let version = null
  ;[ version, response ] = extractResponseVersion( response )

  assert.equal( version, 'abc123' )
  assert.deepEqual( response, { data: { value: 123 } } )

} )
