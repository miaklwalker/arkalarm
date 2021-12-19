const Cluster = require("./Classes/cluster.js");
const fs = require("fs");

module.exports = function createCluster(message,fileSys = fs){
    let guildName,channelName;
    guildName = message.guild.name;
    channelName = message.channel.name;
    let buffer =  fileSys.readFileSync("./serverData.json");
    let config = JSON.parse(buffer)[guildName][channelName.split("-")[2]];
    let {game,ip,maps} = config;
    let cluster = new Cluster(game,ip);
    cluster.config = config;
    Object.values(maps).forEach(cluster.addServer);
    return cluster;
}