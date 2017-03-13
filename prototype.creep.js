/**
 * Find optimal target for storage
 * @return {Object} Storage
 */

Creep.prototype.findStorageTarget = function(){

    var target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    });

    if(!target){
        target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ) &&
                    _.sum(structure.store) < structure.storeCapacity;
            }
        });
    }
    return target;
};


/**
 * Check if creep has memorized target, check if it's full and update if needed
 * @return {Object} Storage
 */

Creep.prototype.getStorageTarget = function(){
    if (this.memory.storageTargetId){
        var storageTarget = Game.getObjectById(this.memory.storageTargetId);

        if ((storageTarget.structureType != STRUCTURE_CONTAINER) &&
            (storageTarget.energy < storageTarget.energyCapacity)){
            // only agree to existing storage if it's normal one and not full
            return storageTarget;
        } else {
            // check if there's spawn/extension need of energy
            storageTarget = this.findStorageTarget();
        }
    } else {
        storageTarget = this.findStorageTarget();
    }

    if (this.memory.storageTargetId != storageTarget.id){
        this.memory.storageTargetId = storageTarget.id;
    }

    return storageTarget;
};


/**
 * Store the energy into the target storage
 */
Creep.prototype.storeEnergy = function(){
        var target = this.findStorageTarget();

        if(target) {

            var transfer = this.transfer(target, RESOURCE_ENERGY);

            if(transfer == ERR_NOT_IN_RANGE) {
                return this.moveTo(target, {visualizePathStyle: {stroke: '#ffe601'}});
            } else {
                this.memory.unloading = this.carry.energy > 0;
                return this.memory.unloading;
            }

        } else {
            console.log('No target found! Harvester', this.name, 'target', target);
        }
};