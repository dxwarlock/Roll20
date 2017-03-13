//PAGECHANGE
on("change:campaign:playerpageid", function (obj, prev) {
    var currentPage = getObj("page", Campaign().get("playerpageid"));
    var pName = currentPage.get("name");
    var help = OuterDiv+iPart + "color: #B3B3B3; background-image: url("+page_img+");'><b>● Page: "+pName+" ●</div></div>";
	sendChat('GM', "/direct " + help);
});
//LOG WHISPER
on('chat:message', function(whisper) {
    if(whisper.type == 'whisper') {
        var who=getObj('player',whisper.playerid);
        if (who !== undefined) sendChat("system", '/w GM <b>' + whisper.who + ' to ' + whisper.target_name + '-<br>' + TopBar+";'>"+whisper.content+"</div>");
    };
});
/*------------------
READY
------------------*/
on('ready', function () {
    'use strict';
    var currentPage = getObj("page", Campaign().get("playerpageid"));
    var currentTime = new Date();
    var timestamp = (new Date(currentTime));
    sendChat('API', "/w GM &{template:RIFTS} {{name=API STARTED}} {{<small>Time:=<small>" + timestamp + "}}");
    //----------------
    var getCleanImgsrc = function (imgsrc) {
        var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)(.*)$/);
        if(parts) {
            return parts[1] + 'thumb' + parts[3];
        }
        return;
    };
    _.chain(findObjs({type: 'character'})).filter(c => '' === c.get('avatar')).each(c => {c.get('defaulttoken', (dt) => {
            let deftoken = JSON.parse(dt);
            if(deftoken && _.has(deftoken, 'imgsrc')) {
                let imgsrc = getCleanImgsrc(deftoken.imgsrc);
                if(imgsrc) {
                    c.set('avatar', imgsrc);
                    sendChat('', `/w gm <div><img src="${imgsrc}" style="max-width: 3em;max-height: 3em;border:1px solid #333; background-color: #999; border-radius: .2em;"><code>Updated ${c.get('name')}</code></div>`);
                }
            }
        });
    });
});
/*------------------
DIVS
------------------*/
var font = 'Arial';
var greenC = "#438032";
var gmC = "#22571F";
var redC = "#A34645";
var grayC = "#666666";
var bShadow ="3px 3px 1px #707070";
var tshadow = "-1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000 , 2px 2px #222;";
//---ImgLinks
var page_img = "http:\\//1.bp.blogspot.com/-7AhozEGVBBA/T6aqzDZcVOI/AAAAAAAAAQQ/TBH76givpIs/s1600/TEXleatherthree.png";
//---START BOXES CODE
var fPart = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; padding: 1px 1px; margin-top: 0.1em; border: 1px solid #000; border-radius: 0px 0px 10px 10px; color: #FFF;";
var lPart = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; font-size: 9pt;  text-align: left; vertical-align: middle; background-position:center; padding: 1px 1px; margin-top: 0.2em; border: 2px solid #000; border-radius: 8px 8px 8px 8px; color: #FFF;";
var hPart = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; font-size: 7pt; text-align: left; vertical-align: middle; background-position:center; padding: 1px 1px; margin-top: 0.2em; border: 2px solid #000; border-radius: 8px 8px 8px 8px; color: #000;";
var iPart = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+";  text-align: center; vertical-align: middle; padding: 0px; margin-top: 0.1em; border: 1px solid #000; border-radius: 10px 10px 10px 10px; color: #FFF;";
var iPart2 = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+";font-size: 10pt; text-align: left; vertical-align: middle; padding: 0px; margin-top: 0.1em; border: 1px solid #000; border-radius: 10px 10px 10px 10px; color: #FFF;";
var gPart = "<div style='box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; padding: 2px 2px; margin-top: 0.2em; border: 1px solid #919191; border-radius: 8px 8px 8px 8px; color: #FFF;";
var ePart = "<div style='box-shadow: "+bShadow+"; text-align: center; vertical-align: middle; padding: 2px 2px; margin-top: 0.2em; border: 1px solid #000; border-radius: 8px 8px 8px 8px; color: #000;";
var brPart = "<div style='font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; border: 1px solid #000; color: #FFF;";
var OuterDiv = '<div style="box-shadow: '+bShadow+'; border: 2px solid black;  text-align: center; vertical-align: middle; background-color: gray; padding: 3px 3px 3px 3px; border-radius: 10px 10px 10px 10px;">';
/*------------------
Generic Functions
------------------*/
function hexToRgbP(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var RGB = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        return RGB;
    }
    throw new Error('Bad Hex');
}
function hexToRgbA(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
    result = [r,g,b,1.0];
    return result;
}
//-------PLAYER COLOR
function GetPColor(Player){
	var cBy = Player.get('controlledby');
	player = getObj('player', cBy);
	pColor = player.get('color');
	return pColor;
}
function PlaySound(trackname, time, stop) {
    var trackname = trackname.toUpperCase()
    var track = findObjs({type: 'jukeboxtrack', title: trackname})[0];
    if(track) {
        track.set('softstop',false);
        track.set('playing',true);
    }
    else {
        log("No track found "+ trackname);
    }
}
//-----
function SetStat(Player1,Atype,cost){
	var ammoC = parseInt(cost);
	var ammo0 = findObjs({_type: "attribute",name: Atype,_characterid: Player1.id}, {caseInsensitive: true})[0];
	if(ammoC === undefined || isNaN(ammoC)) ammoC = 1;
	var cAmmo = parseInt(ammo0.get("current"));
	var mAmmo = parseInt(ammo0.get("max"));
	var curPageID = findObjs({_type: "campaign"})[0].get("playerpageid");
	var curPage = findObjs({_type: "page", _id: curPageID})[0];
	var tokens = findObjs({_type: "graphic", layer:"objects", _pageid: curPageID, name: Player1.get("name")});
	_.each(tokens, function(id) {
		var who = getObj('character', id.get("_represents"));
		var aSet = findObjs({_type: "attribute",name: Atype,_characterid: who.id} , {caseInsensitive: true});
		aSet = aSet[0].id;
		id.set("bar3_link", aSet);
		id.set('bar3_value', cAmmo);
		id.set('bar3_max', mAmmo);
	});
	if (cAmmo < 0 || cAmmo < ammoC) {
		cAmmo = "0";
		ammo0.set('current', cAmmo);
	}
	else if (cAmmo <= 2 || cAmmo < ammoC) {
		cAmmo = cAmmo - ammoC;
		ammo0.set('current', cAmmo);
	}
	else {
		cAmmo = cAmmo - ammoC;
		ammo0.set('current', cAmmo);
	}
}
//RANDOM IMAGE
function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}
//make number
function formatNumber (num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
//set character name
function RollRight (whoPC) {
	var character = findObjs({type: 'character',controlledby: whoPC})[0];
	return character;
}
//find level
function fLevel() {
	var characters = findObjs({_type: "character"});
	var chat = '';
	var lTotal = 0;
	var count = 0;
	_.each(characters, function (id) {
		var aa = id.get("inplayerjournals");
		var aSet = findObjs({_type: "attribute",name: "Level",_characterid: id.id}, {caseInsensitive: true})[0];
		if(aa == "all" && aSet !== undefined) {
		    var aName = findObjs({_type: "attribute",name: "Name",_characterid: id.id}, {caseInsensitive: true})[0];
		    //log(aSet.get("current") + " " +aName.get("current"));
			var a2 = parseInt(aSet.get("current"));
			count = count + 1;
			lTotal = lTotal + a2;
		}
	});
	lTotal = Math.round(lTotal / count);
	return lTotal;
}
//parse loot
function myrolls(loota) {
	for(var i = 0; i < loota.length; i++) {
		var ii = (loota[i].indexOf("[[") != -1);
		if(ii == true) {
			var num = loota[i].replace(/[^0-9]/g, '');
			var res1 = num.substr(0, 1);
			var res2 = num.substr(1, 4);
			var ia = 1;
			var tot = 0;
			while(ia <= res1) {
				var tot = tot + randomInteger(res2);
				ia++;
			}
			return tot;
		}
	}
}
function DT(text){
    sendChat('API', "/w GM " + text);
}
function MakeRollNum(cont, inline) {
    return _.chain(inline)
        .reduce(function (m, v, k) {
        m['$[[' + k + ']]'] = v.results.total || 0;
        return m;
    }, {})
        .reduce(function (m, v, k) {
        d20 = m.replace(k, v);
        return m.replace(k, v);
    },
        cont).value();
};