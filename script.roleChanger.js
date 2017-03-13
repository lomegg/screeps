/*
 * Change role for a creep depending on current needs
 */


// select role for the creep based on his true role (i.e. abilities) and current needs
var selectRole = function(creep){

    switch (creep.memory.role){
        case "harvester" :
        case "bigHarvester" :
            if (!harvestersNeeded(creep.room)){
                if (buildersNeeded(creep.room)) {
                    setRole(creep, 'builder');
                } else if (upgradersNeeded()){
                    setRole(creep, 'upgrader');
                } else {
                    setDefaultRole(creep);
                }
            } else {setDefaultRole(creep);}
            break;
        case 'upgrader':
            if (!upgradersNeeded()){
                if (buildersNeeded(creep.room)){
                    setRole(creep, 'builder');
                } else if (harvestersNeeded(creep.room)){
                    setRole(creep, 'harvester');
                } else {
                    setDefaultRole(creep);
                }
            } else {setDefaultRole(creep);}
            break;
        case 'builder':
            if (!buildersNeeded(creep.room)){
                if (upgradersNeeded()){
                    setRole(creep, 'builder');
                } else if (harvestersNeeded(creep.room)){
                    setRole(creep, 'harvester');
                } else {
                    setDefaultRole(creep);
                }
            } else {setDefaultRole(creep);}
            break;
        default:
            setDefaultRole(creep);
            break;
    }
};

var buildersNeeded = function(room){
    return room.find(FIND_CONSTRUCTION_SITES).length;
};

var upgradersNeeded = function(){
    return _.filter(Game.creeps, (creep) => creep.memory.currentRole == 'upgrader').length < 7;
};

var harvestersNeeded = function(room){
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    }).length;
};

var setDefaultRole = function(creep){
    creep.memory.currentRole = creep.memory.role;
    creep.say('Default role');
    console.log('roleChanger: unset for role', creep.memory.role);
};

var setRole = function(creep, role){
    creep.say('Gone ' + role);
    creep.memory.currentRole = role;
};

module.exports.selectRole = selectRole;