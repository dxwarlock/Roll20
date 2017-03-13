var HR = "<hr style='width: 40%; border: 3px double #000; margin: 2px;'>";
var TopBar = "<div style='width: 95%; box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; padding: 3px 0px; margin: 0px auto; border: 1px solid #000; color: #FFF;";
var MidBar = "<div style='width: 99%; box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; padding: 1px 0px; margin: 0px auto; border: 1px solid #000; color: #FFF;";
var BottBar = "<div style='width: 95%; border-radius: 0px 0px 8px 8px; box-shadow: "+bShadow+"; font-family: "+font+"; text-shadow: "+tshadow+"; text-align: center; vertical-align: middle; padding: 0px 1px; margin: 0px auto; border: 1px solid #000; color: #FFF;";
//-----------
function MakeMid(MidBar,PlayerBGColor,PlayerBarColor){
        var BAR = MidBar + "background-color:"+ PlayerBGColor +";"+ PlayerBarColor +";'>";
        return BAR;
}