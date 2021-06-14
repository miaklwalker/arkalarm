
module.exports = function filterPlayers(cluster){

    const {clusterInfo,config:{enemies,tribemates}} = cluster;

    let clusterPlayers = clusterInfo.map(server=>server.players);

    let serverInfo = [];

    for(let players of clusterPlayers){
        players = players.filter(name => name !== "");
        let serverData = {
            teammates:players.filter(name=>{
                return tribemates.map(member=> member !== name).includes(false);
            }),
            hostiles:players.filter(name=>{
                return enemies.map(member=> member !== name).includes(false);
            }),
            rest:players
                .filter(name=>!enemies.map(member=> member !== name).includes(false))
                .filter(name=>!tribemates.map(member=> member !== name).includes(false)),

        }
        serverInfo.push(serverData);
    }

    return serverInfo
}