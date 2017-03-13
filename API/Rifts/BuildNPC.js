on("change:graphic", function(obj) {
    var gmnotes = decodeURI(obj.get('gmnotes'));
    var oCharacter = getObj('character', obj.get("_represents"));
    if((obj.get("name") !== "" && gmnotes !== "") || oCharacter !== undefined) return;
    obj.set('gmnotes', '{ATTACKS}5{/ATTACKS}<br>' +
    '{INIT}1{/INIT}<br>' +
    '{DAM}1{/DAM}<br>' +
    '{STRK}1{/STRK}<br>' +
    '{ABIL1}1d20+@{STRK}~1d6+@{DAM}~att1~NAME1{/ABIL1}<br>' +
    '{ABIL2}1d20+@{STRK}~1d6+@{DAM}~att2~NAME2{/ABIL2}<br>' +
    '{ABIL3}1d20+@{STRK}~3d6+@{DAM}~Rifle~Rifle{/ABIL3}<br>' +
    '{ABIL4}1d20+@{STRK}~2d6+@{DAM}~Pistol~Pistol{/ABIL4}');
});
on('chat:message', function(msg) {
    if (msg.type == 'api' && msg.content.indexOf('!build') !== -1) {
        if (msg.selected == undefined) {
            sendChat("IMPORT", "/w GM /desc No one selected");
            return;
        }
        var selected = msg.selected;
        //----------loop tokens
        i = 0;
        _.each(selected, function(obj) {
            var token = getObj('graphic', msg.selected[i]._id);
            var MonsterName = token.get("name");
            var CheckSheet = findObjs({_type: "character",name: MonsterName});
            // DO NOT CREATE IF SHEET EXISTS
            if (CheckSheet.length > 0) {
                sendChat("IMPORT", "/w GM This monster already exists.");
                return;
            }
            var Character = createObj("character", {avatar: token.get("imgsrc"),name: MonsterName,archived: false});
            token.set("represents", Character.id);
            token.set("name", MonsterName);
            setatt(token, Character);
            setDefaultTokenForCharacter(Character, token);
            sendChat("IMPORT", "/w GM "+MonsterName+" created.");
            i++;
        });
    }
});

//----------------------
function setatt(token, Character) {
    var bar1m = parseInt(token.get("bar1_max"));
    var bar2m = parseInt(token.get("bar2_max"));
    token.set('flipv', !token.get('flipv'));
    createObj("attribute", {name: "A-BODY",current: bar1m,max: bar1m,characterid: Character.id});
    createObj("attribute", {name: "HP",current: bar2m,max: bar2m,characterid: Character.id});
    var STAT = UnwrapString("ATTACKS", "~", token);
    createObj("attribute", {name: "ATT",current: STAT.uArray[0],max: STAT.uArray[0],characterid: Character.id});
    var STAT = UnwrapString("INIT", "~", token);
    createObj("attribute", {name: "INIT",current: STAT.uArray[0],max: STAT.uArray[0],characterid: Character.id});
    var STAT = UnwrapString("DAM", "~", token);
    createObj("attribute", {name: "DAM",current: STAT.uArray[0],max: STAT.uArray[0],characterid: Character.id});
    var STAT = UnwrapString("STRK", "~", token);
    createObj("attribute", {name: "STRK",current: STAT.uArray[0],max: STAT.uArray[0],characterid: Character.id});
    Create("ABIL1",token,Character);
    Create("ABIL2",token,Character);
    Create("ABIL3",token,Character);
    Create("ABIL4",token,Character);
    Create("ABIL5",token,Character);
    Create("ABIL6",token,Character);
}
//-----------------------
function Create(BIT,token,Character){
    var Ability = UnwrapString(BIT, "~", token);
    if(Ability.uArray[0] == undefined || Ability.uArray[0] == "") return;
    createObj("ability", {
        name: Ability.uArray[3].toUpperCase(),
        description: " ",
        action: "!attack --[["+Ability.uArray[0]+"]] --[["+Ability.uArray[1]+"]] --"+Ability.uArray[2],
        istokenaction: true,
        characterid: Character.id
    });
}
//-----------------------
function UnwrapString(stringname, separator, obj) {
    var uArray = new Array();
    var gmnotes = decodeURI(obj.get('gmnotes'));
    gmnotes = UnescapeString(gmnotes);
    var startPos = gmnotes.indexOf("{" + stringname + "}");
    if (startPos == -1)
        return {
            uArray: uArray
        };
    var endPos = gmnotes.indexOf("{/" + stringname + "}");
    return {
        uArray: gmnotes.substr(startPos + stringname.length + 2, (endPos - startPos) - (stringname.length + 2)).split(separator)
    };
}

function UnescapeString(dirtystring) {
    dirtystring = dirtystring.replace(/%3A/g, ':');
    dirtystring = dirtystring.replace(/%23/g, '#');
    dirtystring = dirtystring.replace(/%3F/g, '?');
    return dirtystring;
}
//-----------------------
on('ready', function() {
  on('add:token', function(obj) {
    var run = function(){
        var oCharacter = getObj('character', obj.get("_represents"));
        if(oCharacter === undefined) return;
        var type = (oCharacter.get("controlledby") === "") ? 'Monster' : 'Player';
        if (type == 'Monster') {
            var maxValue = parseInt(obj.get("bar1_max"), 10);
            var randomChange = randomIntFromInterval(70,100);
            var newAmount = Math.round(maxValue*(randomChange/100));
            obj.set("bar1_value", newAmount);
        }
    }
    _.delay(run, 250);
  });
});
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
//--------------------
var defaultToken = defaultToken || (function() {
	'use strict';
	const version = '1.0',
	feedback = true,
	checkInstall = function() {
		log('-=> DefaultToken v'+version+' <=-');
	},
	getPlayerName = function(who) {
		let match = who.match(/(.*) \(GM\)/);
		if (match) return match[1];
        else return who;
	},
	setDefaultTokenForList = function (list) {
		list.forEach(function (pair) {
			setDefaultTokenForCharacter(pair[0], pair[1]);
		});
	},
	parseOpts = function(content, hasValue) {
		let args, kv, opts = {};
		args = _.rest(content.split(/\s+--/));
		for (let k in args) {
			kv = args[k].split(/\s(.+)/);
			if (_.contains(hasValue, kv[0])) {
				opts[kv[0]] = kv[1];
			} else {
				opts[args[k]] = true;
			}
		}
		return opts;
	},
	handleInput = function(msg) {
		if (msg.type === 'api' && msg.content.search(/^!default-token\b/) !== -1 && msg.selected) {
			const tokensAndChars = _.chain(msg.selected)
				.map(a => getObj('graphic', a._id))
				.filter(o => o.get('_subtype') === 'token')
				.map(o => [o.get('represents'), o])
				.map(a => [getObj('character', a[0]), a[1]])
				.filter(a => a[0])
				.value();
			const opts = _.defaults(parseOpts(msg.content, ['wait']), {wait: '0'});
			_.delay(setDefaultTokenForList, opts.wait, tokensAndChars);
			if (feedback && msg.selected) {
				let output = '/w "' + getPlayerName(msg.who) +
					'" Default tokens set for characters ' +
					_.map(tokensAndChars, a => a[0].get('name')).join(', ') + '.'
				sendChat('API', output);
			}
		}
		return;
	},

	registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());

on('ready',function() {
	'use strict';
	defaultToken.CheckInstall();
	defaultToken.RegisterEventHandlers();
});