var cpu = Game.getUsedCpu();
var oldV = Memory.log.cpu['noteCPU'] || [0];
oldV.unshift(cpu);
if(oldV.length >= 5) oldV = oldV.slice(0, 5);
Memory.log.cpu['noteCPU'] = oldV;
var sum = oldV.reduce(function(a, b) {
	return a + b;
});
var max = _.max(oldV);
var avg = sum / oldV.length;
Memory.log.cpu['note'] = ['[Aver: ' + avg.toFixed(2) + ' Max: ' + max.toFixed(2) + ']'];
//--------------------------
if(Game.time % 5 === 0) {
	for(var Spawns in Game.spawns) {
		var sPower = 0;
		var sPowerC = 0;
		var Power = Game.spawns[Spawns].room.energyAvailable;
		var PowerC = Game.spawns[Spawns].room.energyCapacityAvailable;
		if(Game.spawns[Spawns].room.storage) var sPower = Game.spawns[Spawns].room.storage.store.energy;
		if(Game.spawns[Spawns].room.storage) var sPowerC = Game.spawns[Spawns].room.storage.storeCapacity;
		if(Power + sPower == PowerC + sPowerC) {
			Memory.log.power['limit'] = 1;
		} else Memory.log.power['limit'] = 0;
		Memory.log[Spawns] = Memory.log[Spawns] || {};
		Memory.log[Spawns]['a' + Spawns + 'energy'] = Memory.log['a' + Spawns + 'energy'] || {};
		Memory.log[Spawns]['a' + Spawns + 'energy'] = ['[' + Spawns + ':' + Power + '/' + PowerC + ' - S:' + sPower + '/' + sPowerC + ']'];
	}
}
//----------------

if(Game.time % 5 === 0) {
    console.log('------------')
	var log = Memory.log;
	var log = '';
	for(var i in Memory.log) {
		var notes = Memory.log[i];
		if(notes.note != undefined) log += ' ' + notes.note;
	}
	console.log(log);
	for(var name in Memory.spawns) {
	var log = '';
	for(var i in Memory.log[name]) {
		var notes = Memory.log[name][i];
		if(notes.length != undefined) log += ' ' + notes;
	}
	console.log(log);
}
};

