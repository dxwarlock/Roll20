module.exports = function(creep) {
	DX.SetHarv(creep);
	if(creep.memory.harv == 1) {
		var target = DX.FindEnergy(creep);
	} else {
		var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: function(object) {
				if(object.memory.role === 'B-Builder') {
					if(creep.transferEnergy(object) !== 0) DX.CreepMove(creep, object);
				}
			}
		});
	}
};