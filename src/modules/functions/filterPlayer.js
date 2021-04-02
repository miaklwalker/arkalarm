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
            hostiles: players.filter(player => {
                return enemies.map(enemy => enemy === player).includes(true)
            }),
            teammates: players.filter(player => {
                return tribemates.map(tribemates => tribemates === player).includes(true)
            }),
            rest: players.filter(player => {
                let isNotEnemy = enemies
                    .map(enemy => enemy !== player)
                    .includes(true);

                let isNotTribemate = tribemates
                    .map(tribemates => tribemates !== player)
                    .includes(true);

                return (isNotEnemy && isNotTribemate);
            })
        };
        serverInfo.push(serverData);
    }
    return serverInfo
}

module.exports = filterPlayers;