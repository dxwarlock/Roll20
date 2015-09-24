module.exports = function(creep) {
    DX.ShareEnergy(creep);
    DX.SetHarv(creep);
    if(creep.memory.harv == 1 && creep.room.name == 'E7N3') {
        var target = creep.room.storage;
        if(target.store.energy < 1000){
            DX.CreepMove(creep, Game.flags[creep.room.name + 'Idle'])   
            return;
        }
        target = DX.CreepMove(creep, Game.flags['Pickup']);
        if(creep.room.storage) target = creep.room.storage;
        if(!creep.pos.isNearTo(target)) DX.CreepMove(creep, target);
        else target.transferEnergy(creep);
    } else if(creep.memory.harv == 0 && creep.room.name == 'E7N3') {
        DX.CreepMove(creep, Game.flags['Carry']);
    } else if(creep.memory.harv == 0 && creep.room.name == 'E7N2') {
        DX.DropEneg(creep);
    } else {
        DX.CreepMove(creep, Game.flags['Carry']);
    }
};