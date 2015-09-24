for(var i in Game.rooms) {
    name = Game.rooms[i].name
    Memory.rooms[name].Links = Memory.rooms[name].Links || {};
    //--------------------
    var ID = Memory.rooms[name].Links;
    var link = Game.rooms[i].find(FIND_MY_STRUCTURES, {
        filter: function(object) {
            if(object.structureType == STRUCTURE_LINK) return object;
        }
    });
    for(var i in link) {
        var linknum = 'Link' + (parseInt(i) + 1);
        targLink = link[i].id;
        ID[linknum] = ID[linknum] || targLink;
    }
    //--------------------
    if(ID.Link1) var Link1 = Game.getObjectById(Memory.rooms[name].Links.Link1);
    if(ID.Link2) var Link2 = Game.getObjectById(Memory.rooms[name].Links.Link2);
    if(ID.Link3) var Link3 = Game.getObjectById(Memory.rooms[name].Links.Link3);
    if(ID.Link4) var Link4 = Game.getObjectById(Memory.rooms[name].Links.Link4);
    //--------------------
    if(name == 'E7N3') {
        Link1.transferEnergy(Link2);
        if(Link3.transferEnergy(Link2, 100) == 0) Link3.transferEnergy(Link2);
    }
    if(Link2 && Link1 && name == 'E7N2') {
        if(Link1.transferEnergy(Link2, 400) == 0)Link1.transferEnergy(Link2);
        if(Link3.transferEnergy(Link2, 400) == 0)Link3.transferEnergy(Link2);
    }
    //--------------------
    if(Link4) {
        var target = Link4.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: function(object) {
                return object.memory.role === 'C-Carry';
            }
        });
        if(target.length > 0) {
            Link4.transferEnergy(target[0])
        }
    }
};