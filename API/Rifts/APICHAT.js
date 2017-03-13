/*global gmC PlaySound MakeRollNum TopBar state on MidBar obj BottBar getObj iPart _ playerIsGM brPart RollRight formatNumber findObjs sendChat CONFIG lPart fPart gm_img gPart greenC redC grayC OuterDiv Campaign randomFromTo createObj fixNO toFront randomInteger*/
on('chat:message', function(msg) {
    if (msg.type != "api") return;
//----CHECK CHARACTER
    var cWho = findObjs({ _type: 'character',name: msg.who})[0];
    if (cWho === undefined) {
        cWho = RollRight(msg.playerid);
        msg.who = cWho.get("name");
    }
    var PlayerBGColor = getObj("player", msg.playerid).get("color");
    var PRGB = hexToRgbP(PlayerBGColor);
    var PlayerBG = "background-image:-webkit-linear-gradient(left, #000000 0%,"+PlayerBGColor+" 15%,"+PlayerBGColor+" 85%,#000000 100%);";
    var PlayerBarColor = "background-image: -webkit-linear-gradient(left, rgba(0,0,0,0.8),"+PRGB+","+PRGB+",rgba(0,0,0,0.8));";
    var MIDBAR = MakeMid(MidBar,PlayerBGColor,PlayerBarColor);
    //
    var msgFormula = msg.content.split(/\s+/);
    switch (msgFormula[0].toUpperCase()) {
//PIC
        case "!PIC":
            var piclink = msgFormula[1];
            var Pic = "[pic](" + piclink + ")";
            sendChat('', "&{template:RIFTS} {{name=" + msg.who + "}} {{pic=" + Pic + "}}");
            break;

//GM
        case "!GM":
            PlaySound('dice', 9000);
            var RollColor = "background-image:-webkit-linear-gradient(left, #000000,#848484,#000000);";
            var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>GM</b></div>"+BottBar + RollColor +";'>●Rolls some dice.. ●</div>";
            sendChat('', "/direct " + MSG);
            sendChat('', "/roll [[" + msgFormula[1] + "]]", function(ops) {
                var rollresult = JSON.parse(ops[0].content);
                var GMRW = OuterDiv + fPart + "background-color:" + gmC + ";'>ROLLED " + msgFormula[1] + ":<b> " + rollresult.total + "</div>";
                sendChat('ROLL', "/w GM " + GMRW);
            });
            break;
//PERC
        case "!GMPERC":
            PlaySound('dice', 9000);
            var RollColor = "background-image:-webkit-linear-gradient(left, #000000,#848484,#000000);";
            var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>GM</b></div>"+BottBar + RollColor +";'>●Rolls Perception Check●</div>";
            sendChat('', "/direct " + MSG);
            break;
        case "!CHEST":
            PlaySound('dice', 9000);
    		var Names = [];
    		if(msg.selected == undefined) {
    			sendChat('', "/desc No one selected");
    			return;
    		}
    		var selected = msg.selected;
    		i = 0;
    		_.each(selected, function (obj) {
    			var token = getObj('graphic', msg.selected[i]._id);
    			if(token.get("represents") !== '') {
    				if(token.get('subtype') !== 'token') return;
    				var oCharacter = getObj('character', token.get("_represents"));
    				var name = (oCharacter.get('name'));
    				Names.push(oCharacter);
    			}
    			i++;
    		});
    		var rand = Names[Math.floor(Math.random() * Names.length)];
    		var name = (rand.get('name'));
    		var pColor = GetPColor(rand);
    		var RollColor = "background-image:-webkit-linear-gradient(left, #000000,"+pColor+","+pColor+",#000000);";
            var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>Event: Pick player</b></div>"+BottBar + RollColor +";'>● Who: " + name + "  ●</div>";
            sendChat('', "/direct " + MSG);
            break;
//WHISPER
        case "!WIS":
            var nXp = msg.content.substr(msg.content.indexOf(" ") + 1);
            var wischat = OuterDiv + iPart + "background-color:#831F29;'><b>● " + nXp + " ●</div></div>";
            sendChat('System', "/w " + msg.who + ' ' + wischat);
            sendChat(msg.who, "/w GM " + wischat);
            break;
//CREDITS
        case "!CRED":
            var nCred = msgFormula[1];
            var oC = findObjs({name: "Credits",_type: "attribute",characterid: cWho.id}, {caseInsensitive: true})[0];
            var Cred = oC.get("current");
            var mCred = oC.get("max");
            var total = parseInt(nCred) + parseInt(Cred);
            oC.set('current', total);
            var PlayerBGColor = getObj("player", msg.playerid).get("color");
            var help = lPart + "background-color:#" + greenC + ";'><u>● " + msg.who + "  ●</u><b><br>Credits Adjust: " + formatNumber(nCred) + "<br>Credits Total: " + formatNumber(total) + "</div>";
            sendChat('', "/direct " + help);
            break;
//SAVINGTHROW
        case "!SAVE":
            PlaySound('dice', 9000);
            sendChat('', "/roll [[" + msgFormula[1] + "]]", function(ops) {
                var rollresult = JSON.parse(ops[0].content);
                total = rollresult.total;
                if (msg.who == "NPC") total = total + 1;
                else total = total - 1;
                if (total < 1) total = 1;
                if (total > 20) total = 20;
                var rText = total + "</b> (Needed to beat " + msgFormula[2]+")";
                if (total >= msgFormula[2]) {
                    var RE = "<b>SUCCEEDED!<BR>" + rText + "</b></div>";
                    var COLOR = "#47BE02";
                }
                else {
                    var RE = "<b>FAILED!<BR>" + rText + "</b></div>";
                    var COLOR = "#BE0202";
                }
                var RollColor = "background-image:-webkit-linear-gradient(left, #000000,"+COLOR+","+COLOR+",#000000);";
                var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>" + msg.who + " save: " + msgFormula[3] + "</b></div>"+BottBar + RollColor +";'>" + RE+ "</div>";
                sendChat('', "/direct " + MSG);
            });
            break;
//DC CHECK
        case "!CHECK":
            PlaySound('dice', 9000);
            var RollColor = "background-image:-webkit-linear-gradient(left, #000000,#8B4513,#8B4513,#000000);";
            sendChat('', "/roll [[" + msgFormula[1] + "]]", function(ops) {
                var rollresult = JSON.parse(ops[0].content);
                var RawTotal = rollresult.total;
                if (msg.who == "NPC") RawTotal = RawTotal + 1;
                else rollresult.total = rollresult.total - 1;
                if (RawTotal < 1) RawTotal = 1;
                if (RawTotal > 20) RawTotal = 20;
                var bonus = Math.floor((msgFormula[2] - 10) / 2);
                var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>" + msg.who + " " + msgFormula[3] + " Check:</b></div>"+BottBar + RollColor +";'><b>" + (RawTotal+bonus) + "</b> (" + RawTotal + " + " + bonus + ")</div>";
                sendChat('', "/direct " + MSG);

            });
            break;
//PERC
        case "!PERC":
            PlaySound('dice', 9000);
            var nMod = msgFormula[1];
            sendChat('', "/roll [[" + msgFormula[1] + "]]", function(ops) {
                var rollresult = JSON.parse(ops[0].content);
                total = rollresult.total;
                var try1 = randomInteger(100);
                sendChat(msg.who, "/direct <b>Perc Check");
                sendChat("PERC", "/w GM <b>" + msg.who + " " + [
                    [try1 < total]
                ] + "<br>(" + try1 + " out of " + total + ")");
            });
            break;
//FOOD
        case "!FOOD":
            var nXp = msgFormula[1];
            var oC = findObjs({name: "HUNGER",_type: "attribute",characterid: cWho.id}, {caseInsensitive: true})[0];
            if (oC === undefined || oC.length === 0) {
                sendChat(msg.who, '/direct No FOOD Found, please set!');
                return;
            }
            var XP = oC.get("current");
            var XPx = oC.get("max");
            var total = parseInt(nXp) + parseInt(XP);
            if (total > XPx) total = XPx;
            oC.set('current', total);
            var help = lPart + "background-color:#" + greenC + ";'><u>● " + msg.who + " ate  ●</u><b><br>HUNGER: " + formatNumber(total) + "</div>";
            sendChat('', "/direct " + help);
            break;
//SLEEP
        case "!SLEEP":
            var attirbSleep = findObjs({name: "SLEEPING",_type: "attribute",characterid: cWho.id}, {caseInsensitive: true})[0];
            if (attirbSleep === undefined || attirbSleep.length === 0) {
                sendChat(msg.who, '/direct No SLEEP Found, please set!');
                return;
            }
            var CurrentSleep = attirbSleep.get("current");
            var message = "Is Sleeping"
            if (CurrentSleep == 0) {
                attirbSleep.set('current', 1);
                var message = "Is Sleeping"
            }
            if (CurrentSleep == 1) {
                attirbSleep.set('current', 0);
                var message = "Wakes Up"
            }
            var help = lPart + "background-color:#" + greenC + ";'>● " + msg.who + " " + message + "  ●<b></div>";
            sendChat('', "/direct " + help);
            break;
//XP
        case "!XP":
            var nXp = msgFormula[1];
            var oC = findObjs({name: "XP",_type: "attribute",characterid: cWho.id}, {caseInsensitive: true})[0];
            var oL = findObjs({name: "Level",_type: "attribute",characterid: cWho.id}, {caseInsensitive: true})[0];
            if (oC === undefined || oC.length === 0) {
                sendChat(msg.who, '/direct No XP Found, please set!');
                return;
            }
            var XP = oC.get("current");
            var Level = oL.get("current");
            var mXP = oC.get("max");
            var total = parseInt(nXp) + parseInt(XP);
            oC.set('current', total);
            var help = OuterDiv + lPart + "background-color:#831F29;'><u>● " + msg.who + " ●</u> [Level:" + Level + "] <br>XP Earned: " + formatNumber(nXp) + "<br>XP Total: " + formatNumber(total) + "<br>Next Level: " + formatNumber(mXP) + "</div>";
            sendChat('', "/direct " + help);
            break;
//BLINDROLL
        case "!RB":
            PlaySound('dice', 9000);
            msg.content = MakeRollNum(msg.content, msg.inlinerolls);
            var ar = msg.inlinerolls[0];
            var Atotal = (ar.results.total);
            sendChat('', "/roll [[" + msgFormula[1] + "]]", function(ops) {
                var rollresult2 = JSON.parse(ops[0].content);
                var rollresult = JSON.parse(ops[0].content);
                total = rollresult.total;
                var skillN = "", i = 0, GM = "", RE = "",COLOR = "#7DB1D1";
                while (msgFormula[5 + i] !== undefined) {
                    skillN = skillN + " " + msgFormula[5 + i];
                    i++;
                }
                var RollColor = "background-image:-webkit-linear-gradient(left, #000000,"+COLOR+",#000000);";
                var MSG = TopBar + RollColor +";'></div>"+ MIDBAR +"<b>" + msg.who + " attempts </b></div>";
                var totalAd = parseInt(Atotal) + parseInt(msgFormula[3]);
                var rText = "<b>" + total + "</b> out of <b>" + totalAd + " </b>(" + Atotal + " + " + msgFormula[3] + ")";
                if (msgFormula[4].toUpperCase() == "1") {
                    if (total > 93) {
                        var RE = "OBVIOUS FAILURE!<br><b>Rolled: " + total + "!</b>";
                        COLOR = "#B30000,#B30000,#B30000";
                    }
                    else if (total <= 5) {
                        var RE = "SPECTACULAR SUCCESS!<br><b>Rolled: " + total + "!</b>";
                        COLOR = "#00C400,#00C400,#00C400";
                    }
                    else if (total <= totalAd) {
                        var GM = ";'><B>"+skillN.toUpperCase()+"</B><BR> " + msg.who + " SUCCEEDED!<BR>" + rText + "</div>";
                    }
                    else {
                        var GM = ";'><B>"+skillN.toUpperCase()+"</B><BR> " + msg.who + " FAILED!<BR>" + rText + "</div>";
                    }
                    var RollColor = "background-image:-webkit-linear-gradient(left, #000000,"+COLOR+",#000000);";
                    sendChat(msg.who, "/direct " + MSG + BottBar + RollColor +";'>●<B>"+skillN.toUpperCase()+"</B> ●<br>"+RE+"</div>");
                    if(GM !== "") sendChat('BlindRoll', "/w GM " + MSG +BottBar + RollColor + GM);
                }
                else {
                    if (total > 93) {
                        var RE = "OBVIOUS FAILURE!<br><b>Rolled: " + total + "!</b>";
                        COLOR = "#B30000,#B30000,#B30000";
                    }
                    else if (total <= 5) {
                        var RE = "SPECTACULAR SUCCESS!<br><b>Rolled: " + total + "!</b>";
                        COLOR = "#00C400,#00C400,#00C400";
                    }
                    else if (total <= totalAd) {
                        var RE = msg.who + " SUCCEEDED!<BR>" + rText + "</div>";
                    }
                    else {
                        var RE = msg.who + " FAILED!<BR>" + rText + "</div>";
                    }
                    var RollColor = "background-image:-webkit-linear-gradient(left, #000000,"+COLOR+",#000000);";
                    sendChat(msg.who, "/direct " + MSG + BottBar + RollColor +";'>●<B>"+skillN.toUpperCase()+"</B> ●<br>"+RE+"</div>");
                }
            });
            break;
//ROTATE
        case "!ROTATE":
            var selected = msg.selected;
            var i = 0;
            _.each(selected, function(obj) {
                var token = getObj('graphic', msg.selected[i]._id);
                token.set({
                    rotation: (randomInteger(360) - 1)
                });
                i++;
            });
            break;
        default:
            return;
    }
});