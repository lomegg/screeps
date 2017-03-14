// autospawning script

module.exports = function(){

    var mainSpawn = Game.spawns['Spawn1'];
    var creepsQty = mainSpawn.creepsCount();

    var sortedCreeps = {
        bigHarvesters: {
            qty: creepsQty.bigHarvesters,
            targetQty: 6,
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

        for (let type of ['healer', 'harvester', 'upgrader', 'builder', 'bigHarvester'] ){
            var creepType = sortedCreeps[type + 's'];
            if (creepType.qty < creepType.targetQty) {

                if (energyAvailable >= creepType.cost){

                    //console.log('Attempting to create', _.capitalize(type) + (creepType.qty + 1), 'with cost', creepType.cost, 'and total energy', energyAvailable);

                    var newName = mainSpawn.createCreep(creepType.parts, _.capitalize(type) + (creepType.qty + 1) , {role: type, currentRole: type});
                    if (newName == ERR_NOT_ENOUGH_ENERGY){
                        //console.log('Not enough energy to spawn:', energyAvailable);
                    } else if (newName == ERR_NAME_EXISTS){
                        // looping to find & replace dead creep in the middle of chain
                        //console.log('Seems that', _.capitalize(type) + (creepType.qty + 1), 'already exist!');
                        for (let i = 1; i <= creepType.qty; i ++){
                            //console.log('Checking for', _.capitalize(type) + i);
                            if (!Game.creeps[_.capitalize(type) + i]){
                                //console.log('No', _.capitalize(type) + i,', creating...');
                                return newName =mainSpawn.createCreep(creepType.parts, _.capitalize(type) + i , {role: type, currentRole: type});
                            }
                        }
                    } else {
                        //console.log('Spawning new', type, ': ' + newName);
                    }

                    break;
                } else {
                    //console.log(_.capitalize(type), 'required(' + creepType.qty + ' of ' + creepType.targetQty + ') but only', energyAvailable, 'of ' + creepType.cost + ' present');
                }
            }
        }
    }
};