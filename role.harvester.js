var roleChanger = require('script.roleChanger').selectRole;
var sourceSelect = require('script.sourceSelector');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // set favorite source
        if (!creep.memory.sourceId){
            sourceSelect(creep);
        }

        // deal with side job
        if (creep.memory.role != creep.memory.currentRole){
            if (typeof creep.memory.sideJobCounter  == 'undefined' ){
                creep.memory.sideJobCounter = 0;
            } else if (creep.memory.sideJobCounter < 20){
                creep.memory.sideJobCounter += 1;
            } else if (creep.carry.energy == 0){
                creep.memory.sideJobCounter = 0;
                roleChanger(creep);
            }
        }

        if(creep.carry.energy < creep.carryCapacity && !creep.memory.unloading) {
            var harvest_result = creep.harvest(Game.getObjectById(creep.memory.sourceId));

            if(harvest_result == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceId), {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (harvest_result == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy > 0){
                creep.say('"unload"');
            }
        }
        else {
            var target = findUnloadTarget(creep);
            if(target) {
                //console.log('Target for', creep.name, targets[0]);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (creep.carry.energy > 0){
                    creep.memory.unloading = true;
                } else {
                    creep.memory.unloading = false;
                }
            } else {
                console.log('No target for harvester', creep.name);
                creep.say('No storage');
                creep.memory.unloading = false;
                roleChanger(creep);
            }
        }
    }
};

function findUnloadTarget(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_CONTAINER) &&
                structure.energy < structure.energyCapacity;
        }
    });
    if(targets.length > 0) { return  targets[0];}
}

module.exports = roleHarvester;