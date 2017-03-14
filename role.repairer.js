var roleChanger = require('script.roleChanger').selectRole;
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // deal with side job
        if (creep.memory.role != creep.memory.currentRole){
            if (typeof creep.memory.sideJobCounter == 'undefined' ){
                creep.memory.sideJobCounter = 0;
            } else if (creep.memory.sideJobCounter < 50){
                creep.memory.sideJobCounter += 1;
            } else if (creep.carry.energy == 0){
                creep.memory.working = false;
                creep.memory.sideJobCounter = 0;
                roleChanger(creep);
            }
        }


        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('withdraw');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('repair');
        }

        if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax*0.6)
            });
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleChanger(creep);
            }
        }
        else {
            if (creep.withdrawFromContainer() == ERR_NOT_FOUND){
                if (creep.carry.energy > 0){
                    creep.memory.working = true;
                } else {
                    creep.moveTo(Game.flags.Flag2, {visualizePathStyle: {stroke: '#1313f7'}});
                }
            }
        }
    }
};

module.exports = roleRepairer;