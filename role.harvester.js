var roleChanger = require('script.roleChanger').selectRole;
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // set source
        if (!creep.memory.sourceId ){
            creep.selectSource();
        }

        // deal with side job
        creep.checkSideJob();

        if(creep.carry.energy < creep.carryCapacity && !creep.memory.unloading) {

            // harvest
            var harvest_result = creep.harvest(Game.getObjectById(creep.memory.sourceId));

            if(harvest_result == ERR_NOT_IN_RANGE) {
                creep.cycleSources();
                creep.moveTo(Game.getObjectById(creep.memory.sourceId), {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (harvest_result == ERR_NOT_ENOUGH_RESOURCES){
                if (creep.carry.energy > 0){
                    creep.say('drop rest');
                    creep.storeEnergy();
                } else {
                    creep.cycleSources();
                }
            }
        }
        else if (creep.carry.energy > 0){
            // unload
            var storageResult = creep.storeEnergy();
            if (typeof storageResult == 'undefined'){
                roleChanger(creep);
            }
        } else {
            creep.memory.unloading = false;
        }
    }
};

module.exports = roleHarvester;