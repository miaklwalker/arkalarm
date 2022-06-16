const Cluster = require("./Classes/cluster.js");
const fs = require("fs");


function createCluster(message,fileSys = fs){
    let guildName,channelName;
    guildName = message.guild.name;
    channelName = message.channel.name.split("-")[2];
    let buffer =  JSON.parse(fileSys.readFileSync("./serverData.json"));
    let config = buffer[guildName][channelName];
    let {game,ip,maps} = config;
    let cluster = new Cluster(game,ip);
    cluster.config = config;
    Object.values(maps).forEach(cluster.addServer);
    return cluster;
};

module.exports = createCluster;
