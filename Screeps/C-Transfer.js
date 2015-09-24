module.exports = function(creep) {
	DX.SetHarv(creep);
	if(creep.memory.harv == 1) {
		var target = creep.room.storage
		DX.CreepMove(creep, target);
		target.transferEnergy(creep);
	} else {
		if(Memory.rooms[creep.room.name].Links) {
			var target = Game.getObjectById(Memory.rooms[creep.room.name].Links.Link1);
			if(target) {
				if(creep.pos.inRangeTo(target, 0)) DX.CreepMove(creep, target);
				else if(target.energy > 100) creep.transferEnergy(target);
			}
		}
	}
};