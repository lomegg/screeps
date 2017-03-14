var roleChanger = require('script.roleChanger').selectRole;
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {


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
            creep.say('withdraw');
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
                if (creep.carry.energy > 0){
                    creep.memory.building = true;
                } else {
                    creep.moveTo(Game.flags.Flag2, {visualizePathStyle: {stroke: '#1313f7'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;