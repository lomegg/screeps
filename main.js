require ('prototype.spawn');
require ('prototype.creep');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHealer = require('role.healer');
var roleTower = require('role.tower');
var autospawn = require('script.autospawn');

module.exports.loop = function () {

    autospawn();

    for (let tower of Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})){
        roleTower.run(tower);
    }


    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.currentRole){
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'healer':
                roleHealer.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;

            case 'harvester':
            case 'bigHarvester':
            default:
                roleHarvester.run(creep);
        }
    }
};