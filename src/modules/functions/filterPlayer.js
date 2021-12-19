/**
 * @name filterPlayers
 * @param cluster {Cluster}
 * @description Takes in a Cluster as an argument
 * then separates players into three catogories
 * @returns {[]}
 */
 function filterPlayers(cluster){

    const {clusterInfo,config:{enemies,tribemates}} = cluster;
    let clusterPlayers = clusterInfo.map(server=>server.players);
    let serverInfo = [];

    for(let players of clusterPlayers){
        players = players.filter(name => name !== "");
        let serverData = {
            hostiles:players.filter(name => enemies.includes(name)),
            teammates:players.filter(name => tribemates.includes(name)),
            rest: players.filter(name => !enemies.includes(name) && !tribemates.includes(name))
        };
        serverInfo.push(serverData);
    }
    return serverInfo
}

module.exports = filterPlayers;