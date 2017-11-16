
import { staleCacheConfig } from '../src'
import uuidv1 from 'uuid/v1'
import lscache from 'lscache'
import axios from 'axios'
import { mkFakeServer, loggit } from './helpers'

const staleCache = staleCacheConfig( { execute: req => axios( req ) } )

describe( "main event", () => {

  let server = null

  beforeEach( () => {
    lscache.flush()
    server = mkFakeServer()
  } )

  afterEach( () => {
    server.restore() // is this really necessary?
  } )


  describe( "without tokens", () => {

    specify( "cache miss --> fresh hit --> cache hit", async() => {

      server.happyResponse( "post", "/nowhere/user/1", { name: "kevin" } )
      const request = { url: "/nowhere/user/1", method: "POST" }

      let response = await staleCache(request)

      // nothing in cache yet
      assert.deepEqual( response.data, null )

      // get data from server and also fill cache
      response = await response.fresh()
      assert.deepEqual( response.data, { name: 'kevin' } )

      // run again to get cached results, hoping they arent stale, but they
      // are! we were being optimistic, but that's how this works!
      server.happyResponse( "post", "/nowhere/user/1", { name: 'bob' } )
      response = await staleCache( request )
      assert.deepEqual( response.data, { name: 'kevin' } )

      // now fresh results
      response = await response.fresh()
      assert.deepEqual( response.data, { name: 'bob' } )

    } )

  } )


  describe( "with tokens", () => {

    specify( "cache miss --> fresh hit --> cache hit", async() => {

      const url = "http://localhost/user/1"
      const method = "post"
      const config = { url: url, method: method }

      // local cache should be empty
      let response = await staleCache( config )
      assert.deepEqual(response.data, null)

      const cacheToken = uuidv1()
      const responseData = { name: "kevin" }
      server.happyResponse( method, url, { "responseVersion": cacheToken, ...responseData } )

      // fill local cache with fresh data and store cacheToken
      response = await response.fresh()
      assert.deepEqual(response.data, responseData)

      server.respondWith( method, url, (xhr) => {
        // we expect fresh to add same token to request
        assert.deepEqual( JSON.parse( xhr.requestBody ) , { "responseVersion": cacheToken } )
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({ responseVersion: "OK" }))
      })

      // nothing different here, using local data
      response = await staleCache( config )
      assert.deepEqual( response.data, responseData )
      
      // fresh() should return stale data because we are returning OK above,
      response = await response.fresh()
      assert.deepEqual( response.data, { name: "kevin" } )

      // repeat of above as test of idempotence
      response = await staleCache( config )
      assert.deepEqual( response.data, responseData )
      
      response = await response.fresh()
      assert.deepEqual( response.data, { name: "kevin" } )

     } )

  } )

} )




