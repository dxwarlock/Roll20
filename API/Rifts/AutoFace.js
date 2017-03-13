on("change:graphic", function(obj, prev) {
    if(obj.get("name") == "NR" || Campaign().get("turnorder") == "") return;
    var degs;
    if(obj.get("left") != prev.left || obj.get("top") != prev.top) {
         if(obj.get("layer") == "objects") {
            var movex = obj.get("left") - prev.left;
            var movey = obj.get("top") - prev.top;
            if(movey != 0) {
                degs = Math.atan(movex/movey) * 57.29577;
                if(movey < 0) degs = 360-degs%360;
                else degs = 180-degs%360;
            }
            else if(movex < 0)degs = 270;
            else degs = 90;
            degs = degs - degs%1;
            if (degs > 360) degs = degs-360;
            obj.set("rotation", degs);
        }
    }
});