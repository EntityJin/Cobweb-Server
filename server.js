/// <reference path="./typings/node/node.d.ts" />
'use strict';
var http = require('http');
var websocket = require('websocket-stream');
var player_1 = require("./player");
var Server = (function () {
    function Server(port) {
        var _this = this;
        this.nextPlayer = 0;
        this.players = [];
        this.httpServer = http.createServer();
        this.wss = websocket.createServer({ server: this.httpServer }, function (stream) {
            var nextId = _this.nextPlayer++;
            _this.players.push(new player_1.Player(nextId, _this, stream));
            stream.on('end', function () {
                _this.players.filter(function (player) {
                    return player.id !== nextId;
                });
            });
        });
        this.httpServer.listen(port);
    }
    Server.prototype.stop = function () {
    };
    return Server;
})();
exports.Server = Server;
