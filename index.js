/// <reference path="./typings/primus/primus.d.ts" />
'use strict';
var http = require('http');
var websocket = require('websocket-stream');
var es = require('event-stream');
var Player = (function () {
    function Player(wsStream) {
        console.log('Got new player connection');
        var _this = this;
        this.wsStream = wsStream;
        this.wsStream
            .pipe(es.split())
            .pipe(es.parse())
            .pipe(es.map(function (data, done) {
            var result = _this.processData(data);
            if (!result) {
                done();
                return;
            }
            done(null, result);
        }))
            .pipe(es.stringify())
            .pipe(this.wsStream);
        this.wsStream.on('end', function () {
            console.log('Player disconnected');
        });
    }
    Player.prototype.processData = function (data) {
        console.log(data);
    };
    return Player;
})();
var players = [];
var server = http.createServer();
var wss = websocket.createServer({ server: server }, function (stream) {
    players.push(new Player(stream));
});
server.listen(80);
