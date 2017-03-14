var roleChanger = require('script.roleChanger').selectRole;
var sourceSelect = require('script.sourceSelector');
var roleBuilder = {

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
                creep.memory.building = false;
                roleChanger(creep);
            }
        }


        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.building = false;
                roleChanger(creep);
            }
        }
        else {

            if (creep.withdrawFromContainer() == ERR_NOT_FOUND){
                var harvest_result = creep.harvest(Game.getObjectById(creep.memory.sourceId));
                if(harvest_result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.sourceId), {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (harvest_result == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy > 0){
                    creep.memory.building = true;
                    creep.say('"build"');
                }
            }
        }
    }
};

module.exports = roleBuilder;