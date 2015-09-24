module.exports = function(spawn) {
	var startCpu = Game.getUsedCpu();
	for(var name in Game.spawns) {
		var spawn = Game.spawns[name];
		if(spawn.spawning == null) Memory.log[name][name + 'spawning'] = {};
		//build creeps----------------
		var roles = _.toArray(Object.keys(spawn.memory.minPopulation))
		for(var i in roles) {
			var role = roles[i];
			var creeps = _.filter(Game.creeps, function(creep) {
				if(creep.memory && creep.memory.role && (creep.memory.spawn == spawn.name)) {
					return creep.memory.role == role;
				}
			});
			if(creeps.length < spawn.memory.minPopulation[role]) {
				var totalCost = DX.FindCost(spawn, role);
				//-----------
				var base = name + '_' + role.substring(0, 3).toUpperCase();
				var suffixn = 1;
				var title = base.concat(suffixn.toString());
				while(spawn.canCreateCreep(spawn.memory.creepSpecs[role], title) === -3) {
					suffixn = suffixn + 1;
					title = base.concat(suffixn.toString());
				}
				spawn.createCreep(spawn.memory.creepSpecs[role], title, {
					'role': role,
					'script': role,
					'spawn': spawn.name,
				});
				//----------
				Memory.spawner.on = 1;
				Memory.log[name][name + 'spawning'] = ['[' + name + ' ' + title + ': Cost ' + totalCost + ']'];
				break;
			}
		}
	}
}
var elapsed = Game.getUsedCpu() - startCpu;
//console.log(+elapsed+' CPU time');
};
