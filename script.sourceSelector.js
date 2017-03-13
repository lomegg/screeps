/*
 * Distribute creeps between the sources by available places.
 */

module.exports = function(creep){

    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    var sourceSpots = [4, 3],
        sourcesMap = [];

    // find out how much creeps using which spot
    _.forEach(sources, function(source, index){
        //console.log('spot', source, 'index', index);

        sourcesMap[index] = {
            source: source,
            spots: sourceSpots[index],
            users: _.filter(Game.creeps, (creep) => creep.memory.sourceId == source.id).length,
            spawnDistance: source.pos.findPathTo(Game.spawns['Spawn1']).length
        };

        console.log('users', sourcesMap[index].users, 'spawnDistance', sourcesMap[index].spawnDistance, 'spots', sourcesMap[index].spots)

        sourcesMap[index].rating = sourcesMap[index].users * -10 + sourcesMap[index].spawnDistance + sourcesMap[index].spots * 9;
        console.log ('Rating for Source ' + sourcesMap[index].source.id + ' is ' + sourcesMap[index].rating);
    });


    var sorted = sourcesMap.sort(function(a,b) {return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);} );

    console.log ('Target source:', sorted[0].source.id);

    creep.memory.sourceId = sorted[0].source.id;


};