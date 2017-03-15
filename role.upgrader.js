var roleChanger = require('script.roleChanger');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // deal with side job
        roleChanger.checkSideJob(creep);

        creep.setStatus();

        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {

            creep.witdrawOrMoveToFlag('Upgraders');
        }
    }
};

module.exports = roleUpgrader;