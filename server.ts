/// <reference path="./typings/node/node.d.ts" />

'use strict'

import * as http from 'http';
var websocket = require( 'websocket-stream' );
import { Player } from "./player";

export class Server
{
	private nextPlayer: number;
	private players: Array<Player>;
	private httpServer: http.Server;
	private wss;
	
	constructor( port: number )
	{
		this.nextPlayer = 0;
		this.players = [];
		this.httpServer = http.createServer();
		this.wss = websocket.createServer( { server: this.httpServer }, ( stream ) =>
		{
			let nextId = this.nextPlayer++;
			this.players.push( new Player( nextId, this, stream ) );
			stream.on( 'end', () =>
			{
				this.players.filter( function( player: Player )
				{
					return player.id !== nextId;
				} );
			} );
		} );
		this.httpServer.listen( port );
	}
	
	public stop()
	{
	}
}