var sourceSelect = require('script.sourceSelector');
var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // set favorite source
        if (!creep.memory.sourceId){
            sourceSelect(creep);
        }

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('heal');
        }

        if(creep.memory.working) {
            findAndHeal(creep, 0.7);
        }
        else {
            if(creep.harvest(Game.getObjectById(creep.memory.sourceId)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceId), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

function findAndHeal(creep, hitLevel){
    //console.log(creep.name, 'looking for someone with health lower than', hitLevel);

    if (hitLevel > 1) {hitLevel = 1};

    var targets = creep.room.find( FIND_MY_CREEPS, { filter: creep => creep.hits < (creep.hitsMax*hitLevel)});
    if (targets.length){
        //console.log('Target for heal:', targets[0].name);
        var target = targets[0]}


    if(target) {
        //console.log(creep.name, 'healing', target.name, 'with hits', target.hits, 'of', target.hitsMax);
        if(creep.heal(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            creep.say('+');
        }
    } else {
        if (hitLevel < 1) {
            findAndHeal(creep, hitLevel+0.1);
        } else {
            // store energy
        }
    }
}

module.exports = roleHealer;