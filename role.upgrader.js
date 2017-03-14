var roleChanger = require('script.roleChanger').selectRole;
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // deal with side job
        creep.checkSideJob();

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('withdraw');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            if (creep.withdrawFromContainer() == ERR_NOT_FOUND){
                if (creep.carry.energy > 0){
                    creep.memory.working = true;
                } else {
                    if (roleChanger(creep) == ERR_FULL){
                        creep.moveTo(Game.flags.Flag1, {visualizePathStyle: {stroke: '#1313f7'}});
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;