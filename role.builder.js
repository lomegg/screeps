var roleChanger = require('script.roleChanger');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // deal with side job
        roleChanger.checkSideJob(creep);


        creep.setStatus();

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(creep.memory.working) {
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if (creep.carry.energy > 0){
                    creep.storeEnergy();
                } else {
                    creep.memory.working = false;
                }
                roleChanger.selectRole(creep);
            }
        }
        else {
            if (targets.length){
                creep.witdrawOrMoveToFlag('Builders');
            } else {
                creep.moveToFlag('Builders');
                roleChanger.selectRole(creep);
            }


        }
    }
};

module.exports = roleBuilder;