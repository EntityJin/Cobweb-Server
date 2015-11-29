/// <reference path="../typings/tsd.d.ts" />

'use strict';

import { Server } from "./server";

function wait( millis: number ) {
	return new Promise( resolve => setTimeout( resolve, millis ) );
}

async function main()
{
	await wait( 1000 );

	new Server( 8080 );
};

main();