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
            creep.memory.upgrading = false;
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
            creep.memory.building = false;
            if (!buildersNeeded(creep.room)){
                if (repairersNeeded(creep.room)){
                    setRole(creep, 'repairer');
                } else if (upgradersNeeded()){
                    setRole(creep, 'upgrader');
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

var repairersNeeded = function(room){
    return room.find(FIND_STRUCTURES, {
        filter: object => object.hits < (object.hitsMax*0.6)
    }).length;
};

var upgradersNeeded = function(){
    return _.filter(Game.creeps, (creep) => creep.memory.currentRole == 'upgrader').length < 10;
};

var harvestersNeeded = function(room){
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_CONTAINER
                ) &&
                structure.energy < structure.energyCapacity;
        }
    }).length;
};

var setDefaultRole = function(creep){
    creep.say(creep.memory.currentRole.charAt(0) + ' ⥹ ' + creep.memory.role.charAt(0));
    creep.memory.currentRole = creep.memory.role;
};

var setRole = function(creep, role){
    creep.say(creep.memory.role.charAt(0) + ' → ' + role.charAt(0));
    creep.memory.currentRole = role;
};

module.exports.selectRole = selectRole;