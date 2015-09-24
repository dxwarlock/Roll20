module.exports = function(creep) {
    Memory.rooms[creep.room.name] = Memory.rooms[creep.room.name] || {};
    DX.ShareEnergy(creep);
    if(!creep.memory.target) {
        var targetR = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: function(object) {
                 return object.structureType == STRUCTURE_RAMPART && object.hits < 1000;
            }
        });
        if(targetR.length > 0) creep.repair(targetR[0]);
        if(creep.room.memory.ToBuild) {
          var targetB = creep.room.memory.ToBuild[0];
          creep.memory.target = targetB;
        }
        if(creep.room.name !== "E8N3" && creep.room.name !== "E7N3") {
            var target = creep.room.controller;
            if(!creep.pos.isNearTo(target)) DX.CreepMove(creep, target);
            else {
                DX.Build_Time(creep, target, 1);
                creep.upgradeController(target);
            }
        } else DX.CreepMove(creep, Game.flags[creep.room.name + 'BIdle'])
    } else if(creep.memory.target) {
        target = Game.getObjectById(creep.memory.target.id);
        if(!target) delete creep.memory.target;
        else {
            if(!creep.pos.isNearTo(target)) DX.CreepMove(creep, target);
            else {
                DX.Build_Time(creep, target, 5);
                creep.build(target);
            }
        }
    }
};