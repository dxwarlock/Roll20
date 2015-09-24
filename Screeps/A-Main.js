global.DX = require('Z_Functions');
// --------------------------------------
for(var name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name];
}
for(var name in Memory.rooms) {
    if(!Game.rooms[name]) delete Memory.rooms[name];
    else if(Game.time % 10 === 0) {
        DX.FindRepairs(Game.rooms[name]);
        DX.FindBuilds(Game.rooms[name]);
    }
}
//--------------------------------------
require('Z_Population');
var Z_Spawner = require('Z_Spawner');
//--------------------------------------
for(var name in Memory.spawns) {
if(!Game.spawns[name]) delete Memory.spawns[name];
    else Z_Spawner(Memory.spawns[name]);
}
Memory.flags = Memory.flags || {};
for(var name in Game.flags) {
    Memory.flags[name] = Game.flags[name];
}
for(var i in Memory.flags) {
    if(!Game.flags[i]) delete Memory.flags[i];
}
//--------------------------------------
var MMiner = require('M-Miner');
var MHelper = require('M-Helper');
var BBuilder = require('B-Builder');
var BHelper = require('B-Helper');
var RRepair = require('R-Repair');
var MRunnerH = require('M-RunnerH');
var FGuard = require('F-Guard');
var FHeal = require('F-Heal');
var CCarry = require('C-Carry');
//----------------------------------
for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.script) {
        var creepMem = creep.memory.script.replace('-', '');
        eval(creepMem)(creep);
        if(creepMem !== 'MMiner')DX.LootDropped(creep);
        if(creep.ticksToLive < 20) creep.say('DYING!')
        }
    else creep.say('LOST')
};
// --------------------------------------
require('Z_Announce');
require('Z_Links');