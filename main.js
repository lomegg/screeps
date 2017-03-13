var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.builder');
var roleTower = require('role.tower');
require ('script.creepCounter')();
var autospawn = require('script.autospawn');

module.exports.loop = function () {

    autospawn();

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('6d5765b2c59ab3c616cdae8c');
    if(tower) {
        roleTower.run(tower);
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