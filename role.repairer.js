var roleChanger = require('script.roleChanger');
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // deal with side job
        roleChanger.checkSideJob(creep);


        creep.setStatus();

        if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax*0.6)
            });
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleChanger.selectRole(creep);
            }
        }
        else {
            creep.witdrawOrMoveToFlag('Builders');
        }
    }
};

module.exports = roleRepairer;