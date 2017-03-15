var roleChanger = require('script.roleChanger');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // set source
        if (!creep.memory.sourceId ){
            creep.selectSource();
        }

        // deal with side job
        //roleChanger.checkSideJob(creep);

        if(creep.carry.energy < creep.carryCapacity && !creep.memory.unloading) {

            // harvest
            var harvest_result = creep.harvest(Game.getObjectById(creep.memory.sourceId));

            if(harvest_result == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(Game.getObjectById(creep.memory.sourceId), {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH){
                    creep.cycleSources();
                }
            } else if (harvest_result == ERR_NOT_ENOUGH_RESOURCES){
                if (creep.carry.energy > 0){
                    creep.say('drop rest');
                    creep.storeEnergy(creep.findStorageTargetContainer());
                } else {
                    creep.moveToFlag('Harvesters');
                    creep.cycleSources();
                }
            }
        }
        else if (creep.carry.energy > 0){
            // unload



            var storageResult = creep.storeEnergy(creep.findStorageTargetContainer());
            if (typeof storageResult == 'undefined'){
                //roleChanger.selectRole(creep);
            }
        } else {
            creep.memory.unloading = false;
        }
    }
};

module.exports = roleHarvester;