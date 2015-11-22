/// <reference path="./typings/node/node.d.ts" />
'use strict';
var es = require('event-stream');
var State;
(function (State) {
    State[State["Online"] = 0] = "Online";
    State[State["Offline"] = 1] = "Offline";
})(State || (State = {}));
var Player = (function () {
    function Player(id, server, ws) {
        var _this = this;
        console.log('Got new player connection');
        this._id = id;
        this.server = server;
        this.ws = ws;
        this.wsOut = es.stringify();
        this.state = State.Online;
        this.ws
            .pipe(es.split())
            .pipe(es.parse())
            .pipe(es.map(function (data, done) {
            if (_this.state === State.Offline) {
                done(null, null);
                return;
            }
            var result = _this.processData(data);
            if (!result) {
                done();
                return;
            }
            done(null, result);
        }))
            .pipe(this.wsOut);
        this.wsOut
            .pipe(es.map(function (data, done) {
            if (_this.state === State.Offline) {
                done(null, null);
                return;
            }
            done(null, data);
        }))
            .pipe(this.ws);
        this.ws.on('end', function () {
            console.log('Player disconnected');
            _this.state = State.Offline;
        });
    }
    Object.defineProperty(Player.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.processData = function (data) {
        console.log(data);
    };
    return Player;
})();
exports.Player = Player;
