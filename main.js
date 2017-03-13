// autospawning script

module.exports = function(){

    var sortedCreeps = {
        bigHarvesters: {
            qty: Memory.screepsQty.bigHarvesters,
            targetQty: 0,
            parts: [WORK,WORK,CARRY,MOVE]
        },
        harvesters: {
            qty: Memory.screepsQty.harvesters,
            targetQty: 9,
            parts: [WORK,WORK,CARRY,CARRY,MOVE]
        },
        upgraders: {
            qty: Memory.screepsQty.upgraders,
            targetQty: 8,
            parts: [WORK,WORK,WORK,CARRY,MOVE]
        },
        builders: {
            qty: Memory.screepsQty.builders,
            targetQty: 8,
            parts: [WORK,WORK,WORK,CARRY,MOVE]
        }
    };

    var mainSpawn = Game.spawns['Spawn1'];

    //console.log('Harvesters:', sortedCreeps.harvesters.qty, ', Builders:', sortedCreeps.builders.qty, ', Upgraders:', sortedCreeps.upgraders.qty);

    for (let type of ['harvester', 'upgrader', 'builder', 'bigHarvester'] ){
        var creepType = sortedCreeps[type + 's'];
        if (creepType.qty < creepType.targetQty && !mainSpawn.spawning) {

            console.log('Attempting to create', _.capitalize(type) + (creepType.qty + 1));

            var newName = mainSpawn.createCreep(creepType.parts, _.capitalize(type) + (creepType.qty + 1) , {role: type, currentRole: type});
            if (newName == ERR_NOT_ENOUGH_ENERGY){
                console.log('Not enough energy to spawn:', mainSpawn.energy);
            } else if (newName == ERR_NAME_EXISTS){
                // looping to find & replace dead creep in the middle of chain
                for (let i = 1; i < creepType.qty; i ++){
                    if (!Game.creeps[_.capitalize(type) + i]){
                        return newName =mainSpawn.createCreep(creepType.parts, _.capitalize(type) + i , {role: type, currentRole: type});
                    }
                }
            } else {
                Memory.screepsQty[type + 's'] += 1;
                console.log('Spawning new', type, ': ' + newName);
            }

            break;
        } else if (mainSpawn.spawning){
            console.log('Spawn1 is spawning', mainSpawn.spawning.name, 'already');
            break;
        }
    }
};