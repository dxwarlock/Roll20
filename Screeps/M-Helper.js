module.exports = function(creep) {
	DX.SetHarv(creep);
	//------------------------------
	if(creep.memory.harv == 1) {
		if(!creep.memory.target) {
			var targets = creep.room.find(FIND_DROPPED_ENERGY);
			if(targets.length > 0) creep.memory.target = targets[_.random(0, targets.length - 1)];
		}
		if(creep.memory.target) {
			var target = Game.getObjectById(creep.memory.target.id);
			if(!target) delete creep.memory.target;
			else if(creep.pickup(target) == -9) DX.CreepMove(creep, target);
		} else if(Memory.rooms[creep.room.name].Links) {
			var targetLink = Game.getObjectById(Memory.rooms[creep.room.name].Links.Link2);
			if(targetLink) {
				if(targetLink.energy == 0 && creep.carry.energy > 0) DX.DropEneg(creep);
				else if(!creep.pos.isNearTo(targetLink)) DX.CreepMove(creep, targetLink);
				else targetLink.transferEnergy(creep);
			}
		} else DX.CreepMove(creep, Game.flags[creep.room.name + 'Idle']);
	}
	//----------------
	else {
		delete creep.memory.target;
		DX.DropEneg(creep);
	}
};