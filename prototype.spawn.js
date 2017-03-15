/**
 * Counts creeps for the spawn and current/main role.
 * @param {String} roleType - Takes 'currentRole' / 'role' to distinguish current situation from default roles. Defaults to 'role'
 * @return {Object} String, Number
 */

StructureSpawn.prototype.creepsCount = function(roleType){
    if (roleType != 'currentRole'){
        roleType = 'role';
    }

    var creeps = this.room.find(FIND_MY_CREEPS);
    var creepsCount = {};
    for (let job of ['builder', 'harvester', 'bigHarvester', 'upgrader', 'repairer', 'healer', 'truck']){
        creepsCount[job + 's'] = _.sum(creeps, (c) => c.memory[roleType] == job);
    }
    return creepsCount;
};