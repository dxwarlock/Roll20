/*------------------
GREET
------------------*/
var DXGREET = DXGREET || (function() {
    'use strict';
    var Greet = function(obj) {
            var name = obj.get("_displayname");
            var isGM = "";
            var currentTime = new Date();
            var timestamp = (new Date(currentTime));
            if(playerIsGM(obj.id) === true) isGM = " [GM]";
            if(obj.get("_online") == true) {
                setTimeout(function() {
                    sendChat('', "&{template:RIFTS} {{name=Hello}} {{<small>Who:=" + name + isGM + "}}{{<small>Time:=<small>" + timestamp+"}}");
                }, 3000);
            }
            if(obj.get("_online") == false) {
                setTimeout(function() {
                    sendChat('', "&{template:RIFTS} {{name=Goodbye}} {{<small>Who:=" + name + isGM + "}}{{<small>Time:=<small>" + timestamp+"}}");
                }, 500);
            }
        },
        registerEventHandlers = function() {
            on('change:player:_online', Greet);
        };
    return {
        RegisterEventHandlers: registerEventHandlers
    };
}());
on('ready', function() {
    'use strict';
    DXGREET.RegisterEventHandlers();
});