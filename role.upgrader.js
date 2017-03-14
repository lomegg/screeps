var roleChanger = require('script.roleChanger').selectRole;
var roleUpgrader = {

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
                roleChanger(creep);
            }
        }

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('withdraw');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            if (creep.withdrawFromContainer() == ERR_NOT_FOUND){
                if (creep.carry.energy > 0){
                    creep.memory.upgrading = true;
                } else {
                    creep.moveTo(Game.flags.Flag1, {visualizePathStyle: {stroke: '#1313f7'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;