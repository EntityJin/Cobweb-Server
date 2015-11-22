/// <reference path="./typings/node/node.d.ts" />

'use strict';

import * as stream from 'stream';
import { Server } from './server';
let es = require( 'event-stream' );

enum State
{
	Online,
	Offline
}

export class Player
{
	private _id: number;
	private server: Server;
	private ws: stream.Duplex;
	private wsOut: stream.Duplex;
	private state: State;
	
	constructor( id: number, server: Server, ws: stream.Duplex ) {
		console.log( 'Got new player connection' );
		
		this._id = id;
		this.server = server;
		this.ws = ws;
		this.wsOut = es.stringify();
		this.state = State.Online;
		
		this.ws
			.pipe( es.split() )
			.pipe( es.parse() )
			.pipe( es.map( ( data, done ) =>
			{
				if ( this.state === State.Offline ) {
					done( null, null );
					return;
				}
				
				let result = this.processData( data );
				if ( !result ) {
					done();
					return;
				}
				done( null, result );
			} ) )
			.pipe( this.wsOut );
		
		this.wsOut
			.pipe( es.map( ( data, done ) =>
			{
				if ( this.state === State.Offline ) {
					done( null, null );
					return;
				}
				done( null, data );
			} ) )
			.pipe( this.ws );
			
		this.ws.on( 'end', () => 
		{
			console.log( 'Player disconnected' );
			this.state = State.Offline;
		} );
	}
	
	get id(): number
	{
		return this._id;
	}
	
	private processData( data:Object ): void {
		console.log( data );
	}
}