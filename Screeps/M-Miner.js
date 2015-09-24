module.exports = function(creep) {
	//------------
	var source = Game.getObjectById(creep.memory.source);
	if(source == null) {
		var source = DX.getOpenSource(creep);
		if(!source) return;
		DX.setSourceToMine(source, creep);
	}
	if(Memory.sources[source.id] == undefined) Memory.sources[source.id] = {
		id: source.id
	};
	Memory.sources[source.id].miner = creep.id;
	if(!creep.pos.inRangeTo(source, 1)) DX.CreepMove(creep, source);
	//------------
	else {
		var link = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: function(object) {
				return object.structureType == STRUCTURE_LINK;
			}
		});
		if(link && creep.pos.inRangeTo(link, 1)) {
			if(creep.pos.inRangeTo(link, 1)) creep.transferEnergy(link);
			if(link.energy < link.energyCapacity-20) creep.harvest(source);
			//------------
		} else {
			var helper = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: function(object) {
					return object.memory.role !== 'M-Miner';
				}
			});
			if(helper && creep.pos.inRangeTo(helper, 1)) {
				creep.transferEnergy(helper);
			}
			creep.harvest(source);
			if(creep.carry.energy == creep.carryCapacity) creep.dropEnergy();
		}
	}
};