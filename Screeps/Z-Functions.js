Memory.log.power = Memory.log.power || {};
Memory.log.cpu = Memory.log.cpu || {};
Memory.sources = Memory.sources || {};
Memory.spawner = Memory.spawner || {};
//--------------------------------------
module.exports = {
    JSONs: JSONs,
    FindRepairs: FindRepairs,
    FindBuilds: FindBuilds,
    LootDropped: LootDropped,
    FindEnergy: FindEnergy,
    ShareEnergy: ShareEnergy,
    FindCost: FindCost,
    SetHarv: SetHarv,
    CreepMove: CreepMove,
    Build_Time: Build_Time,
    minTommss: minTommss,
    Claim: Claim,
    getOpenSource: getOpenSource,
    setSourceToMine: setSourceToMine,
    DropEneg: DropEneg,
};
//--------------------------------------
function CreepMove(creep, target) {
    creep.moveTo(target, {reusePath: 50})
}
//--------------------------------------
function FindRepairs(Room) {
    var repairs = [];
    var defense = [];
    var roads = [];
    var ToRepair = Room.find(FIND_STRUCTURES, {
        filter: function(object) {
            var sType = object.structureType
            Memory.Repairs.Repair[sType] = Memory.Repairs.Repair[sType] || 0;
            if((sType == STRUCTURE_WALL || sType == STRUCTURE_RAMPART) && object.hits < Memory.Repairs.Repair[sType] && object.hitsMax != 1) defense.push(object);
            if(sType == STRUCTURE_ROAD && object.hits < Memory.Repairs.Repair[sType]) roads.push(object);
        }
    });
    var roads = _.sortBy(roads, "hits");
    var defense = _.sortBy(defense, "hits");
    var repairs = repairs.concat(roads);
    var repairs = repairs.concat(defense);
    Room.memory.ToRepair = repairs
}
//--------------------------------------
function FindBuilds(Room) {
    var builds = [];
    var builds = Room.find(FIND_CONSTRUCTION_SITES);
    Room.memory.ToBuild = builds;
}
//--------------------------------------
function LootDropped(creep) {
    var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
    if(targets.length > 0) {
        creep.pickup(targets[0]);
    }
}
//--------------------------------------
function FindEnergy(creep) {
    var target = {};
    if(creep.room.storage) {
        target = creep.room.storage;
    } else {
        var roomPower = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(object) {
                if(object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) {
                    return object.energy !== 0;
                }
            }
        });
        target = creep.pos.findClosest(roomPower);
    }
    if(target.transferEnergy(creep) == ERR_NOT_IN_RANGE) DX.CreepMove(creep, target);
}
//--------------------------------------
function ShareEnergy(creep) {
    var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: function(object) {
            if(object.memory.role == 'B-Builder' && object.carry.energy < creep.carry.energy) {
                creep.transferEnergy(object, (creep.carry.energy - object.carry.energy) / 2);
            }
        }
    });
}
//--------------------------------------
function DropEneg(creep) {
    var roomPower = creep.room.find(FIND_MY_STRUCTURES, {
        filter: function(object) {
            if(object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) {
                return object.energy < object.energyCapacity;
            }
        }
    });
    var target = creep.pos.findClosestByRange(roomPower);
    if(target) {
        DX.CreepMove(creep, target);
        creep.transferEnergy(target);
        return;
    }
    else if(creep.room.storage) {
        var target = creep.room.storage;
        if(!creep.pos.isNearTo(target)) DX.CreepMove(creep, target);
        else creep.transferEnergy(target);
        return;
    }
}
//--------------------------------------
//--------------------------------------
//--------------------------------------
//--------------------------------------
function FindCost(spawn, role) {
    var totalCost = 0;
    for(var i in spawn.memory.creepSpecs[role]) {
        var Part = spawn.memory.creepSpecs[role][i];
        if(Part == MOVE) totalCost += 50;
        else if(Part == WORK) totalCost += 100;
        else if(Part == CARRY) totalCost += 50;
        else if(Part == ATTACK) totalCost += 80;
        else if(Part == RANGED_ATTACK) totalCost += 150;
        else if(Part == HEAL) totalCost += 250;
        else if(Part == TOUGH) totalCost += 10;
    }
    return totalCost;
}
//--------------------------------------
function minTommss(minutes) {
    var Hour = Math.floor(Math.abs(minutes))
    var Min = Math.floor((Math.abs(minutes) * 60) % 60);
    var Sec = Math.floor((Math.abs(minutes) * 60 * 60) % 60);
    return(Hour < 10 ? "0" : "") + Hour + ":" + (Min < 10 ? "0" : "") + Min + ":" + (Sec < 10 ? "0" : "") + Sec;
}
//--------------------------------------
function Build_Time(creep, target, offset) {
    if(Game.time % 3 !== 0) return;
    if(creep.carry.energy === 0) return;
    var B = target.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: function(object) {
            return object.memory.role === creep.memory.role;
        }
    });
    var time = Math.round(((target.progressTotal - target.progress) / creep.getActiveBodyparts(WORK) / B.length / offset));
    var timeS = DX.minTommss(time * 1.3 / 60 / 60);
    creep.say(timeS);
}
//--------------------------------------
function setSourceToMine(source, creep) {
    if(!source) return;
    if(Memory.sources[source.id] == undefined) Memory.sources[source.id] = {
        id: source.id
    };
    Memory.sources[source.id].miner = creep.id;
    creep.memory.source = source.id;
}
//--------------------------------------
function getOpenSource(creep) {
    var source = creep.pos.findClosest(FIND_SOURCES, {
        filter: function(source) {
            if(Memory.sources[source.id] == undefined || Memory.sources[source.id].miner == undefined || Memory.sources[source.id].miner == creep.id) return true;
            if(Game.getObjectById(Memory.sources[source.id].miner) == null) return true;
            return false;
        }
    });
    return source;
}
//--------------------------------------
function Claim(creep) {
    if(!creep.room.controller.my && creep.room.find(FIND_HOSTILE_SPAWNS) !== '') {
        creep.moveTo(creep.room.controller);
        creep.claimController(creep.room.controller);
    }
}
//--------------------------------------
function SetHarv(creep) {
    creep.memory.harv = creep.memory.harv || '';
    if(creep.carry.energy === 0) creep.memory.harv = 1;
    if(creep.carry.energy == creep.carryCapacity) creep.memory.harv = 0;
}
//--------------------------------------
function JSONs(string) {
    console.log(JSON.stringify(string));
}