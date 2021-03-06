/*
 * Change role for a creep depending on current needs
 */


// select role for the creep based on his true role (i.e. abilities) and current needs
var selectRole = function(creep){

    //console.log('changing role for', creep.name);

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
                structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    }).length;
};

var setDefaultRole = function(creep){
    //console.log('setting', creep, ' to default role');
    if (creep.memory.currentRole == creep.role){
        return ERR_FULL;
    } else {
        creep.say(creep.memory.currentRole.charAt(0) + ' ⥹ ' + creep.memory.role.charAt(0));
        creep.memory.currentRole = creep.memory.role;
        return OK;
    }
};

var setRole = function(creep, role){
    //console.log('setting', creep, ' to role', role);
    if (creep.memory.currentRole == creep.role){
        return ERR_FULL;
    } else {
        creep.say(creep.memory.role.charAt(0) + ' → ' + role.charAt(0));
        creep.memory.currentRole = role;
        return OK;
    }
};



/*
 * Check if creep is doing someone else's job and stop it on counter
 * @return {Int} response
 * */

var checkSideJob = function(creep){
    //console.log('side job counter for', creep.name, 'is', creep.memory.sideJobCounter, 'current Role:', creep.memory.currentRole);

    if (creep.memory.role != creep.memory.currentRole){
        if (_.isUndefined(creep.memory.sideJobCounter)){
            creep.memory.sideJobCounter = 0;
            //console.log (creep.name, 'creep.memory.sideJobCounter set as', creep.memory.sideJobCounter);
        } else if (creep.memory.sideJobCounter < 20){
            creep.memory.sideJobCounter += 1;
        } else if (creep.carry.energy == 0){
            creep.memory.sideJobCounter = 0;
            selectRole(creep);
        }
    } else {return OK;}
};

module.exports.selectRole = selectRole;
module.exports.checkSideJob = checkSideJob;