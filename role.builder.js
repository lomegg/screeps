var roleChanger = require('script.roleChanger').selectRole;
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // deal with side job
        creep.checkSideJob();


        creep.setStatus();

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
            creep.witdrawOrMoveToFlag('Builders');
        }
    }
};

module.exports = roleBuilder;