module.exports = function(){
    // count and store quantity of creeps
    Memory.screepsQty = {
        harvesters: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length,
        bigHarvesters: _.filter(Game.creeps, (creep) => creep.memory.role == 'bigHarvester').length,
        builders: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length,
        upgraders: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length
    }
};