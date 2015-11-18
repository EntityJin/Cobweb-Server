/// <reference path="./typings/primus/primus.d.ts" />

'use strict'

import http = require( 'http' );
import stream = require( 'stream' );
var websocket = require( 'websocket-stream' );
var es = require( 'event-stream' );

class Player
{
	private wsStream: stream.Duplex;
	private writeStream: stream.Duplex;
	
	constructor( wsStream: stream.Duplex ) {
		console.log( 'Got new player connection' );
		
		let _this = this;
		this.wsStream = wsStream;
		this.wsStream
			.pipe( es.split() )
			.pipe( es.parse() )
			.pipe( es.map( function( data, done )
			{
				let result = _this.processData( data );
				if ( !result ) {
					done();
					return;
				}
				done( null, result );
			} ) )
			.pipe( es.stringify() )
			.pipe( this.wsStream );
			
		this.wsStream.on( 'end', () => 
		{
			console.log( 'Player disconnected' );
		} );
	}
	
	private processData( data:Object ): void {
		console.log( data );
	}
}

let players = [];

let server = http.createServer();
let wss = websocket.createServer( { server: server }, function( stream )
{
	players.push( new Player( stream ) );
} );

server.listen( 80 );