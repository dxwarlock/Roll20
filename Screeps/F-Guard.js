module.exports = function(creep) {
    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if(targets.length > 0) {
        creep.rangedAttack(targets[0]);
        return;
    } else {
        DX.CreepMove(creep, Game.flags[creep.room.name + 'Defend'])
    }
};