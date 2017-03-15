var roleTruck = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.setStatus();

        // find target
        var target = creep.findStorageTargetSpawn();
        if (!target){
            target = creep.findStorageTargetTower();
        }

        if(creep.memory.working) {
            if(target) {
                // if has resources, transfer/move to target
                creep.storeEnergy(target);

            } else {
                // if no target, find storage container and store energy there
                if (creep.carry.energy > 0){
                    target = creep.findStorageTargetContainer();

                    if (target){
                        creep.storeEnergy(target);
                    } else {
                        creep.moveToFlag('Trucks');
                    }
                } else {
                    creep.moveToFlag('Trucks');
                }
            }
        }
        else {
            if (target){
                creep.witdrawOrMoveToFlag('Trucks');
            } else {
                creep.moveToFlag('Trucks');
            }
        }
    }
};

module.exports = roleTruck;