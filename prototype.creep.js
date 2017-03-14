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

/*
* Select source based on range and capacity
* */
Creep.prototype.selectSource = function(){

    delete this.memory.sourceId;

    var spawn = Game.spawns['Spawn1'];
    var creep = this;
    var sources = spawn.room.find(FIND_SOURCES,{
            filter: (structure) => {
                return (structure.energy > structure.energyCapacity*0.05);
            }
    });

    if (sources.length == 1){
        this.setSource(sources[0].id);
    } else if (sources.length > 1){


        var sourceSpots = [4, 3],
            sourcesMap = [];

        // find out how much creeps using which spot
        _.forEach(sources, function(source, index){
            //console.log('spot', source, 'index', index);

            console.log(creep, creep.name);

            sourcesMap[index] = {
                source: source,
                spots: sourceSpots[index],
                users: creep.room.find(FIND_MY_CREEPS, {filter: (creep) => { return creep.memory.sourceId == source.id }}).length,
                distance: creep.pos.findPathTo(source).length
            };

            console.log('users', sourcesMap[index].users, 'distance', sourcesMap[index].distance, 'spots', sourcesMap[index].spots);

            sourcesMap[index].rating = sourcesMap[index].users * -10 -sourcesMap[index].distance + sourcesMap[index].spots * 10;
            console.log ('Rating for Source ' + sourcesMap[index].source.id + ' is ' + sourcesMap[index].rating);
        });


        var sorted = sourcesMap.sort(function(a,b) {return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);} );

        console.log ('Target source:', sorted[0].source.id);

        creep.say('new src');
        creep.setSource(sorted[0].source.id);
    }

};

/*
 * Set source for creep
 * */
Creep.prototype.setSource = function(sourceId){
   this.memory.sourceId = sourceId;
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