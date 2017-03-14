var roleChanger = require('script.roleChanger').selectRole;
var roleBuilder = {

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
            creep.say('build');
        }

        if(creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.working = false;
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

module.exports = roleBuilder;