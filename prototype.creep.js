/**
 * Switch to another source if creep is being ifle for a while
 * @return {Object} Storage
 */

Creep.prototype.cycleSources = function(){
    if (!this.memory.cycleCounter){
        this.memory.cycleCounter = 1;
    } else if (this.memory.cycleCounter < 8){
        this.memory.cycleCounter += 1;
        //this.say(this.memory.cycleCounter.toString());
    } else {
        this.memory.cycleCounter = 0;
        this.selectSource();
    }
};


/**
 * Find dropped energy and pick it up
 * @return {Object} Storage
 */

Creep.prototype.findDroppedEnergy = function(){

    var energy = this.pos.findClosestByPath(FIND_DROPPED_ENERGY);

    if (energy) {
        if (this.pickup(energy) == ERR_NOT_IN_RANGE){
            this.moveTo(energy);
            return ERR_NOT_IN_RANGE;
        } else {
            return OK;
        }
    } else {
        return ERR_NOT_FOUND;
    }
};


/**
 * Find optimal target for storage
 * @return {Object} Storage
 */

Creep.prototype.findStorageTarget = function(){

    // try spawn / ext
    var target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN
                    //|| structure.structureType == STRUCTURE_TOWER
                ) &&
                structure.energy < structure.energyCapacity;
        }
    });

    // try semi-filled or less tower
    if (!target){
        target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.energy < structure.energyCapacity*0.5;
            }
        });
    }

    // go for container
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


/*
 * Move to flag if exists
 * @param {String} flag - flag name
 * @return {Int} response
 * */

Creep.prototype.moveToFlag = function(flag){
    if (flag){
        return this.moveTo(Game.flags[flag], {visualizePathStyle: {stroke: '#1313f7'}});
    } else {
        return ERR_INVALID_ARGS;
    }
};


/**
 * Find container with energy that's up for grabs
 * @return {Object} Storage
 */

Creep.prototype.nearestEnergyContainer = function(){

    return this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ) &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });
};


/*
* Select source based on range and capacity
* @return {Int} response
* */
Creep.prototype.selectSource = function(){

    delete this.memory.sourceId;

    var spawn = Game.spawns['Spawn1'];
    var creep = this;
    var sources = spawn.room.find(FIND_SOURCES,{
            filter: (structure) => {
                return (structure.energy > structure.energyCapacity*0.01);
            }
    });

    if (sources.length == 1){
        this.setSource(sources[0].id);
        return OK;
    } else if (sources.length > 1){


        var sourceSpots = [4, 3],
            sourcesMap = [];

        // find out how much creeps using which spot
        _.forEach(sources, function(source, index){

            sourcesMap[index] = {
                source: source,
                spots: sourceSpots[index],
                users: creep.room.find(FIND_MY_CREEPS, {filter: (creep) => { return creep.memory.sourceId == source.id }}).length,
                distance: creep.pos.findPathTo(source).length
            };

            //console.log('users', sourcesMap[index].users, 'distance', sourcesMap[index].distance, 'spots', sourcesMap[index].spots);

            sourcesMap[index].rating = sourcesMap[index].users * -10 -sourcesMap[index].distance + sourcesMap[index].spots * 10;
            //console.log ('Rating for Source ' + sourcesMap[index].source.id + ' is ' + sourcesMap[index].rating);
        });


        var sorted = sourcesMap.sort(function(a,b) {return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);} );

        //console.log ('Target source:', sorted[0].source.id);

        creep.say('new src');
        creep.setSource(sorted[0].source.id);
        return OK;
    }

};

/*
 * Set source for creep
 * @param {String} sourceId - Game Id of source
 * @return {Int} response
 * */
Creep.prototype.setSource = function(sourceId){
   this.memory.sourceId = sourceId;
   return OK;
};

/*
 * Set status for creep based on carried energy
 * @return {Int} response
 * */
Creep.prototype.setStatus = function(){
    if(this.memory.working && this.carry.energy == 0) {
        this.memory.working = false;
        this.say('withdraw');
    }
    if(!this.memory.working && this.carry.energy == this.carryCapacity) {
        this.memory.working = true;
        this.say('work');
    }
    console.log(this.name, 'working: ',this.memory.working);
    return OK;
};

/**
 * Store the energy into the target storage
 * @return {Int} response
 */
Creep.prototype.storeEnergy = function(){
        var target = this.findStorageTarget();

        if(target) {

            var transfer = this.transfer(target, RESOURCE_ENERGY);

            if(transfer == ERR_NOT_IN_RANGE) {
                return this.moveTo(target, {visualizePathStyle: {stroke: '#ffe601'}});
            } else {
                if (transfer == OK && this.carry.energy == 0){
                    this.cycleSources();
                }
                this.memory.unloading = this.carry.energy > 0;
                return transfer;
            }
        } else {
            //console.log('No target found! Harvester', this.name, 'target', target);
            this.cycleSources();
            return ERR_NOT_FOUND;
        }
};


/**
 * Withdraw energy from a container
 * @return {Int} response
 */
Creep.prototype.withdrawFromContainer = function(){
    var container = this.nearestEnergyContainer();
    if (container){
        if(this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
            return ERR_NOT_IN_RANGE;
        } else {
            return OK;
        }

    } else {
        return ERR_NOT_FOUND;
    }
};


/*
 * Witdraw from nearest container or go rest at flag
 * @param {String} flag - flag name
 * @return {Int} response
 * */
Creep.prototype.witdrawOrMoveToFlag = function(flag){
    if (this.withdrawFromContainer() == ERR_NOT_FOUND){
        if (this.carry.energy > 0){
            this.memory.working = true;
            return ERR_NOT_FOUND;
        } else {
            if (this.findDroppedEnergy() == ERR_NOT_FOUND){
                this.moveToFlag(flag);
            } else {
                return OK;
            }
        }
    } else {
        return OK;
    }
};