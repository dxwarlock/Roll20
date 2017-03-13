/*global gmC state on obj getObj iPart _ playerIsGM brPart RollRight formatNumber findObjs sendChat CONFIG lPart fPart gm_img gPart greenC redC grayC OuterDiv Campaign randomFromTo createObj fixNO toFront randomInteger*/
var WillTurnOrder = {};
var TurnData = {};
var BestRoll = 0;
var intChat = '';
/*------------------
API CHAT COMMANDS
------------------*/
on('chat:message', function(msg) {
    /*--TURNS-SET--*/
    if(msg.type == 'api' && msg.content.indexOf('!Turns') !== -1) {
		var turnorder;
		if(!Campaign().get("turnorder")) return;
		turnorder = JSON.parse(Campaign().get("turnorder"));
		sort(turnorder); /*--SORT TURNS--*/
		turnorder = JSON.parse(Campaign().get("turnorder"));
		SetPurple(turnorder, false);
		for(var i in turnorder) {
			cAttacks = 5; /*-DEFAULT ATTACKS-*/
			name = turnorder[i].id; /*-TURN ORDER WHO-*/
			id1 = getObj("graphic", turnorder[i].id); /*-GET TOKEN-*/
			pColor = '#636363';
			if(id1 != undefined) {
				oCharacter = getObj("character", id1.get("represents"));
				iName = id1.get("name");
				if(oCharacter != undefined) {
					iName = oCharacter.get("name");
					oAttacks = findObjs({
						_type: "attribute",
						name: "ATT",
						_characterid: oCharacter.id
					})[0];
					if(oAttacks != undefined) cAttacks = parseInt(oAttacks.get("current"));
					var type = (oCharacter.get("controlledby") === "") ? 'Monster' : 'Player';
					if(type == 'Player') {
						var cBy = oCharacter.get('controlledby');
						if(cBy.split(',').length == 1 && cBy != 'all') {
							player = getObj('player', cBy);
							pColor = player.get('color');
						}
					}
				}
				if(oCharacter == undefined && id1.get("gmnotes") != "") {
					cAttacks = id1.get("gmnotes");
				}
				if(oCharacter == undefined) {
					setbars(id1);
				}
				var init = parseInt(turnorder[i].pr);
				if(init < cAttacks) {
					init = cAttacks;
					turnorder[i].pr = cAttacks;
				}
				addPlayer(name, parseInt(init), parseInt(cAttacks));
			}
		}
		var sTurns = createOrder();
		sort(sTurns); /*--SORT TURNS--*/
		var aFirst = JSON.parse(Campaign().get("turnorder"));
		var iName2 = getObj("graphic", aFirst[1].id).get("name");
		if(getObj("graphic", aFirst[1].id).get("layer") == 'gmlayer') iName2 = "UNKNOWN";
		var C = fPart + " background-color:#A80000;'><b>● ROUND STARTS ●</b></div>";
		var R = fPart + " background-color:#A80000;'><b>" + iName2 + "</b> goes first!</div>";
		sendChat('TurnTracker', "/direct " + C + R + "<br>" + intChat);
		reset();
	}
	/*--RESET--*/
	if(msg.type == 'api' && msg.content.indexOf('!Reset') !== -1) {
		if(!Campaign().get("turnorder")) return;
		var turn_order = JSON.parse(Campaign().get("turnorder"));
		Campaign().set("turnorder", '');
		sendChat('', '/desc Turns Reset!');
	}
});
/*------------------
HIGHLIGHT TURNS
------------------*/
on("change:campaign:turnorder", function(obj, prev) {
	if(!Campaign().get("turnorder")) return;
	var turn_order = JSON.parse(Campaign().get("turnorder"));
	if(!turn_order.length) return;
	if(!turn_order[0].id == -1) {
		SetPurple(turn_order, true);
		return;
	}
	var current_token = getObj("graphic", turn_order[0].id);
	if(current_token != undefined) {
		if(turn_order[0].pr == turn_order[0].pr) {
			var iName2 = getObj("graphic", current_token.id).get("name");
			oCharacter = getObj("character", current_token.get("represents"));
			pColor = '#ff0000';
			if(getObj("graphic", current_token.id).get("layer") == 'gmlayer') pColor = '#3D3D3D';
			if(oCharacter != undefined) {
				var type = (oCharacter.get("controlledby") === "") ? 'Monster' : 'Player';
				if(type == 'Player') {
					var cBy = oCharacter.get('controlledby');
					if(cBy.split(',').length == 1 && cBy != 'all') {
						player = getObj('player', cBy);
						pColor = player.get('color');
					}
				}
			}
			dieName = 'StartRound';
			var to = JSON.parse(obj.get('turnorder'));
			loc = _.find(to, function(e) {
				return dieName === e.custom;
			});
			if(loc !== undefined) {
				movemarker(current_token, pColor, iName2);
			} else SetPurple(turn_order, 1);
		}
	}
});
/*------------------
FUNCTIONS
------------------*/
//--MOVE TURN MARKER
function movemarker(current_token, pColor, iName2) {
	if(current_token.get("layer") == "gmlayer") {
        piclink = 'http://www.clker.com/cliparts/i/X/D/N/j/p/icon-with-question-mark-hi.png';
		iName2 = "UNKNOWN";
	} else {
        var piclink = current_token.get("imgsrc");
        var size = current_token.get("height");
        var HITS = {
            "angle": 0,
        	"angleRandom": 180,
        	"duration": 10,
        	"emissionRate": 100,
        	"endColour": [255, 255, 255, 0],
        	"endColourRandom": [0, 0, 0, 0],
        	"gravity": {"x":0, "y":0},
        	"lifeSpan": 10,
        	"lifeSpanRandom": 30,
        	"maxParticles": 100,
        	"size": size/2,
        	"sizeRandom": 15,
        	"speed": 0.0*(size/30),
        	"speedRandom": 0.0*(size/30),
        	"startColour": [50, 50, 150, 0.1],
        	"startColourRandom": [0, 0, 0, 0.1]
        };
    spawnFxWithDefinition(current_token.get("left"),current_token.get("top"), HITS, current_token.get("_pageid"));
	}
	var picbox = "<div style= 'background-color:#ffffff; display: inline-block; border: 1px solid #000; margin: 0.2em; border-radius: 10px 10px 10px 10px; align:'center''><img src=" + piclink + " style=height:30px; width:30px;'></div>";
	var table = '<table width="100%" cellspacing="0" cellpadding="0"><tr><td width="20%">' + picbox + '</td><td width="90%"><b>Turn: ' + iName2 + '</b></td></tr></table>';
	var R = iPart2 + " background-color:#" + pColor + ";'>" + table + "</div>";
	sendChat('', "/direct " + R);
};
//--SET BARS
function setbars(id1) {
	if(id1.get("bar1_value") == "" || id1.get("bar2_value") == "") {
		id1.set('bar1_value', 100);
		id1.set('bar1_max', 100);
		id1.set('bar2_value', 100);
		id1.set('bar2_max', 100);
	}
};

function SetPurple(turn_order, toggle) {
	i = 0;
	_.each(turn_order, function(obj) {
		var tokens = getObj('graphic', turn_order[i].id);
		if(tokens == undefined) return;
		tokens.set("status_purple", toggle);
		i++;
	});
};
//--SORT LIST
function sort(order) {
	var nOrd = order.sortByProp('pr');
	Campaign().set("turnorder", JSON.stringify(nOrd));
};
Array.prototype.sortByProp = function(p) {
	return this.sort(function(a, b) {
		return(parseInt(a[p], 10) < parseInt(b[p], 10)) ? 1 : (parseInt(a[p], 10) > parseInt(b[p], 10)) ? -1 : 0;
	});
};
//--ADDPLAYER
function addPlayer(id, Roll, Attack) {
	var inc = Roll / Attack;
	inc = Math.round(inc * 100) / 100;
	var init = Roll;
	if(Roll > BestRoll) {
		BestRoll = Roll;
	}
	var table = [];
	for(var i = 0; i < Attack; i++) {
		if(init >= 0) {
			if(init == 0) init = 1;
			table.push(parseInt(init));
			init = (init - inc);
		}
	}
	output = pColor;
	iName = iName.toUpperCase();
	turnNums = table.toString();
	if(id1.get("layer") == 'gmlayer') iName = "UNKNOWN";
	ChatSay = iPart + "background-color:" + output + ";'>" + "<b>" + iName + "</b> (Att:" + Attack + ") (Roll:" + Roll + ")<br></b><b>" + turnNums + "</b></div>";
	if(iName == "UNKNOWN") ChatSay = "";
	intChat1 = ChatSay;
	intChat += intChat1;
	TurnData[id] = {"Roll": Roll,"Attack": Attack,"Table": table};
};
//--CREATE ORDER
function createOrder() {
	var order = [];
	for(i = (BestRoll + 1); i > 0; i--) {
		_.each(TurnData, function(value, key) {
			if(value.Table.indexOf(i) != -1) {
				order.push({"id": key,"pr": i,"custom": ""});
			}
		});
	}
	order.unshift({"id": '-1',"pr": 100,"custom": "StartRound"});
	return order;
};
//--RESET TURNS
function reset() {
	TurnData = {};
	BestRoll = 0;
	intChat = '';
};