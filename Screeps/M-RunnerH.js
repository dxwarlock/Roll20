module.exports = function(creep) {
	DX.ShareEnergy(creep);
	DX.SetHarv(creep);
	if(creep.carry.energy > 0) creep.memory.harv = 0;
	//check rooms----------------
	if(creep.room.name == 'E7N3' && creep.memory.harv == 0) {
		if(Memory.rooms[creep.room.name].Links.Link3) {
			var link = Game.getObjectById(Memory.rooms[creep.room.name].Links.Link3);
		}
		//------------
		if(link) {
			DX.CreepMove(creep, link);
			creep.transferEnergy(link);
		} else DX.DropEneg(creep);
		return;
	} else if(creep.room.name == 'E7N3' && creep.memory.harv == 1) {
		var path = creep.pos.findPathTo(49, 8);
		if(path[0] !== undefined) creep.move(path[0].direction);
		return;
	} else if(creep.room.name == 'E8N3' && creep.memory.harv == 0) {
		var path = creep.pos.findPathTo(0, 8);
		if(path[0] !== undefined) creep.move(path[0].direction);
		return;
	} else if(creep.room.name == 'E8N3' && creep.memory.harv == 1) {
	    var target = DX.FindEnergy(creep);
	}
};