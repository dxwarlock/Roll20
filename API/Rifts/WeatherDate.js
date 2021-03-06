/*global MonthId gmC state on log myrolls obj getObj iPart _ playerIsGM brPart RollRight formatNumber findObjs sendChat CONFIG lPart fPart gm_img gPart greenC redC grayC OuterDiv Campaign randomFromTo createObj fixNO toFront randomInteger*/
//CODE-----------------
on("chat:message", function(msg) {
    var msgTxt = msg.content;
    var msgFormula = msgTxt.split(" ");
    if(msg.type == "api" && msgTxt.toUpperCase().indexOf('!HOUR') !== -1) {
        var nHour = msgFormula[1];
        if(nHour == undefined) nHour = 0;
        time(nHour);
        FoodSet(nHour);
        SleepSet(nHour);
    }
    if(msg.type == "api" && msgTxt.toUpperCase().indexOf('!WEATHER') !== -1) {
        weath(function() {
            var wText = state.weather
            sendChat('', "&{template:RIFTS} {{name=Nature}} {{color=world}}" + wText);
        });
    }
    if(msg.type == "api" && msgTxt.toUpperCase().indexOf('!NOW') !== -1) {
        cText = state.world;
        wText = state.weather;
        sendChat('', cText + wText);
    }
});
//
function weath(callback) {
    var wText = "",
    sentinel = true;
    //Get Date-----------------
    var croll = findObjs({_type: 'character', name: 'World'})[0];

    var oMonth = findObjs({name: "Month",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var MonthNum = parseInt(oMonth.get("current"));

    var oDay = findObjs({name: "Day",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var oDay = parseInt(oDay.get("current"));

    var oYear = findObjs({name: "Year",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var oYearNum = parseInt(oYear.get("current"));

    var oTerrain = findObjs({name: "Terrain",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var oTerrainname = oTerrain.get("current");
    var oTerrainNum = parseInt(oTerrain.get("max"));

    var oHour = findObjs({name: "Hour",_type: "attribute", _characterid: croll.id}, {caseInsensitive: true})[0];
    var oHourNum = parseInt(oHour.get("current"));
    log(oTerrainNum)
    //Lookup name-----------------
    MonthId.forEach(function(opts) {
        var oType = "";
        if(MonthNum == opts.Month) {
            var Calm = 100;
            var cDust = 51;
            var cRain = 50;
            var cRare = 5;
            //---find temp
            var rN = Math.floor(Math.random() * 30) - 15;
            var tChange = rN;
            var TempBase = (opts.Base + rN + oTerrainNum);
            if(oHourNum >= 17 || oHourNum <= 7) TempBase = TempBase - 20;
            var TempBaseReal = TempBase;
            if(TempBase <= 20) {
                var TempBase = TempBase + "F (Exposer Warning!)";
            } else if(TempBase >= 100) {
                var TempBase = TempBase + "F (Heat Warning!)";
            } else {
                var TempBase = TempBase + "F ";
            }
            //----------
            var ranType = randomInteger(100);
            if(ranType < cRare) {
                oType = "Rare";
            } else if(ranType < cRain) {
                oType = "Rain";
            } else if(ranType < cDust) {
                oType = "Dust";
            } else {
                oType = "Calm";
            }
            //----------
            if(TempBaseReal <= 35 & oType == "Rain") oType = "Snow";
            if(TempBaseReal > 35 & oType == "Snow") oType = "Rain";
            //----------
            var oDesc = "";
            sentinel = false;
            sendChat("NoOne", "/roll 1t[W-" + oType + "]", function(ops) {
                var rollresult = JSON.parse(ops[0].content);
                oDesc = rollresult.rolls[0].results[0].tableItem.name;
                var output1 = TempBase;
                var output2 = "<i>" + oType;
                wText = "{{<small>Type:=<b><small>" + output2 + "</b>}} {{<small>Temp:=<small>" + output1 + "}} {{<small>Weather:=<small>" + oDesc + "}}";
                state.weather = wText;
                callback();
            });
        }
    });
    if(sentinel) {
        callback();
    }
};
//-------TIME FUNCTION
function time(HourT) {
    var nHour = parseInt(HourT);
    var croll = findObjs({ _type: 'character',name: 'World'})[0];
    //--hour------------------------
    var Hour = findObjs({name: "Hour",_type: "attribute", _characterid: croll.id}, {caseInsensitive: true})[0];
    var HourNum = parseInt(Hour.get("current"));
    var mHourNum = parseInt(Hour.get("max"));
    //--day------------------------
    var DayChat = findObjs({name: "Day",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var DayNum = parseInt(DayChat.get("current"));
    var mDayNum = parseInt(DayChat.get("max"));
    //--month------------------------
    var MonthChat = findObjs({name: "Month",_type: "attribute",_characterid: croll.id}, {caseInsensitive: true})[0];
    var MonthNum = parseInt(MonthChat.get("current"));
    var mMonthNum = parseInt(MonthChat.get("max"));
    //--year------------------------
    var YearChat = findObjs({name: "Year", _type: "attribute", _characterid: croll.id}, {caseInsensitive: true})[0];
    var YearNum = parseInt(YearChat.get("current"));
    //--------------
    //set
    Hour.set('current', HourNum + nHour);
    HourNum = parseInt(Hour.get("current"));
    var nDay1 = '';
    if(HourNum >= mHourNum || HourNum == 0) {
        Hour.set('current', (HourNum - 24) + 0);
        DayChat.set('current', DayNum + 1);
        var nDay1 = "{{NewDay=<b>A New Day is Here</b>}}";
    }
    if(DayNum > mDayNum) {
        DayChat.set('current', 1);
        MonthChat.set('current', MonthNum + 1);
    }
    if(MonthNum > mMonthNum) {
        MonthChat.set('current', 1);
        YearChat.set('current', YearNum + 1);
    }
    wText = "";
    var cWeather = randomInteger(7);
    var finishWork = function() {
        //------------------
        var HourNum = parseInt(Hour.get("current"));
        var DayNum = parseInt(DayChat.get("current"));
        var MonthNum = parseInt(MonthChat.get("current"));
        var Clock = (HourNum >= 12) ? 'PM' : 'AM';
        if(HourNum >= 12) {
            HourNum = HourNum - 12;
        }
        if(HourNum == 0) HourNum = 12;
        MonthId.forEach(function(opts) {
            if(MonthNum == opts.Month) {
                var MonthName = opts.Name;
                var Day = HourNum + " " + Clock + " " + MonthName + " " + DayNum + ", " + YearNum;
                var cText = "&{template:RIFTS} {{name=World}} {{color=world}} {{<small>Time:=" + Day + "}}" + nDay1;
                state.world = cText;
                if(cWeather == 1) wText = state.weather
                sendChat('', cText + wText);
            }
        });
    };
    if(cWeather == 1 && nHour != 0) {
        weath(finishWork);
        wText = state.weather;
    } else {
        finishWork();
    }
};
/*------------------
WEATHER STUFF
------------------*/
//---MONTH
var MonthId = [
    {Month: 1,Name: 'January',Base: 30},
	{Month: 2,Name: 'February',Base: 50},
	{Month: 3,Name: 'March',Base: 50},
	{Month: 4,Name: 'April',Base: 70},
	{Month: 5,Name: 'May',Base: 80},
	{Month: 6,Name: 'June',Base: 90},
	{Month: 7,Name: 'July',Base: 90},
	{Month: 8,Name: 'August',Base: 90},
	{Month: 9,Name: 'September',Base: 80},
	{Month: 10,Name: 'October',Base: 70},
	{Month: 11,Name: 'November',Base: 50},
	{Month: 12,Name: 'December',Base: 30}
	 ];