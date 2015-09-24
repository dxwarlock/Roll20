Memory.Repairs = Memory.Repairs || {};
Memory.Repairs.Repair = Memory.Repairs.Repair || {};
Memory.Repairs.RepairMax = Memory.Repairs.RepairMax || {};
module.exports = function(creep) {
    var fname = creep.name;
    if(Game.flags[fname]) Game.flags[fname].remove();
    DX.SetHarv(creep);
    if(creep.carry.energy === 0) {
        delete creep.memory.target;
    }
    //----------------------
    if(creep.memory.harv == 1) {
        var target = DX.FindEnergy(creep);
        return;
    }
    //----------------------
    if(creep.memory.target) {
        target = Game.getObjectById(creep.memory.target.id);
        if(!target) {
            delete creep.memory.target;
            return;
        }
        target.pos.createFlag(fname);
        if(Game.time % 7 === 0)creep.say(target.hits);
        if (creep.repair(target) == ERR_NOT_IN_RANGE) DX.CreepMove(creep, target);
        var sType = target.structureType
        Memory.Repairs.RepairMax[sType] = Memory.Repairs.RepairMax[sType] || 0;
        if(target.hits > Memory.Repairs.RepairMax[sType] && sType == STRUCTURE_RAMPART) delete creep.memory.target;
        if(target.hits > Memory.Repairs.RepairMax[sType] && sType == STRUCTURE_WALL) delete creep.memory.target;
        if(target.hits > Memory.Repairs.RepairMax[sType] && sType == STRUCTURE_ROAD) delete creep.memory.target;
        return;
    } else {
        if(creep.room.memory.ToRepair) var repairs = creep.room.memory.ToRepair;
        if(repairs && repairs.length > 0) {
            var reps = creep.room.find(FIND_MY_CREEPS, {
                filter: function(creep) {
                    return creep.memory.role === 'R-Repair';
                }
            });
            for(var j = 0; j < reps.length; j++) {
                if(reps[j] == creep) {
                    var Rep = repairs[0 + j];
                    if(Rep == undefined) return;
                    creep.memory.target = Rep;
                }
            }
        } else {
            target = Game.flags[creep.room.name+'Repair']
            DX.CreepMove(creep, target);
        }
    }
};