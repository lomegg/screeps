// autospawning script

module.exports = function(){

    var mainSpawn = Game.spawns['Spawn1'];
    var creepsQty = mainSpawn.creepsCount();

    var sortedCreeps = {
        bigHarvesters: {
            qty: creepsQty.bigHarvesters,
            targetQty: 7,
            parts: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            cost: 750
        },
        harvesters: {
            qty: creepsQty.harvesters,
            targetQty: 0,
            parts: [WORK,WORK,WORK,CARRY,CARRY,MOVE],
            cost: 450
        },
        upgraders: {
            qty: creepsQty.upgraders,
            targetQty: 8,
            parts: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            cost: 500
        },
        builders: {
            qty: creepsQty.builders,
            targetQty: 4,
            parts: [WORK,WORK,WORK,CARRY,MOVE],
            cost: 400
        },
        healers: {
            qty: creepsQty.healers,
            targetQty: 0,
            parts: [WORK,HEAL,CARRY,MOVE],
            cost: 450
        },
        trucks: {
            qty: creepsQty.trucks,
            targetQty: 3,
            parts: [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            cost: 450
        }
    };

    //console.log('Harvesters:', sortedCreeps.harvesters.qty, ', Builders:', sortedCreeps.builders.qty, ', Upgraders:', sortedCreeps.upgraders.qty);

    if (!mainSpawn.spawning){

        // check if we have enough energy to spawn a creep
        var energyAvailable = mainSpawn.energy;
        _.filter(Game.structures, function(structure){
            if (structure.structureType == STRUCTURE_EXTENSION){
                energyAvailable += structure.energy;
            }
        });

        var nonEmptyContainers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        }).length;

        for (let type of ['healer', 'harvester', 'upgrader', 'builder', 'bigHarvester', 'truck'] ){
            var creepType = sortedCreeps[type + 's'];
            if (creepType.qty < creepType.targetQty) {

                if (energyAvailable >= creepType.cost){

                    // create only harvesters when containers are empty
                    if ((type == 'harvester') || (type == 'bigHarvester') || nonEmptyContainers > 0){
                        var newName = mainSpawn.createCreep(creepType.parts, _.capitalize(type) + (creepType.qty + 1) , {role: type, currentRole: type});

                        if (newName == ERR_NOT_ENOUGH_ENERGY){
                            //console.log('Not enough energy to spawn:', energyAvailable);
                        } else if (newName == ERR_NAME_EXISTS){

                            // looping to find & replace dead creep in the middle of chain
                            for (let i = 1; i <= creepType.qty; i ++){
                                if (!Game.creeps[_.capitalize(type) + i]){
                                    return newName = mainSpawn.createCreep(creepType.parts, _.capitalize(type) + i , {role: type, currentRole: type});
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        return ERR_FULL;
    } else {
        return ERR_BUSY;
    }
};