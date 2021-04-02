const Discord = require('discord.js');
const fs = require("fs");
const Gamedig = require("gamedig");
const Server = require("../../modules/Classes/Server.js");
const Cluster = require("../../modules/Classes/Cluster.js");
const filterPlayers = require("../../modules/functions/filterPlayer.js");







function createCluster(message,fileSys = fs){
    let guildName,channelName;
    guildName = message.guild.name;
    channelName = message.channel.name;
    let buffer =  fileSys.readFileSync("./serverData.json");
    let config = JSON.parse(buffer)[guildName][channelName.split("-")[2]];
    let {game,ip,maps} = config;
    let cluster = new Cluster(game,ip);
    cluster.config = config;
    Object.values(maps).forEach(cluster.addServer);
    let counterDB =  JSON.parse(fileSys.readFileSync("./useCount.json"));
    let counter = counterDB?.[guildName];
    if(counter){
        counterDB[guildName].scan++
    }else{
        counterDB[guildName] = {};
        counterDB[guildName].scan = 1
    }
    fileSys.writeFileSync("./useCount.json",JSON.stringify(counterDB,null,2));

    return cluster;
}
async function getClusterInfo(message,api=Gamedig){
    let cluster = createCluster(message);
    let clusterInfo = [];
    for(let server of cluster.servers) {
        try {
            // Get server info from the steam api
            let {players: p, name, map, raw: {numplayers}} = await api.query(server);
            // filter out the random empty player objects
            let players = p.map(obj => obj.name).filter(name => name !== undefined);

            let serverOutput = {name, map, numplayers, players};
            clusterInfo.push(serverOutput);

        } catch (err) {
            console.error(err);
        }
    }
    cluster.clusterInfo = clusterInfo;
    return cluster;
}

async function scanCluster (client, message){
    try {
        let cluster = await getClusterInfo(message);
        let playerData = filterPlayers(cluster);
        let serverData = cluster.clusterInfo.map((server, index) => {
            return {
                map: server.map,
                name: server.name,
                value: playerData[index],
            }
        });
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Cluster Scan')
            .setAuthor('Ark Alarm', 'https://i.imgur.com/zlHASmr.png', 'https://discord.js.org')
            .setDescription(`Here is your report on the cluster`)
            .setTimestamp()
            .setFooter('Ark Alarm - Michael Walker - 2020', 'https://imgur.com/zlHASmr')
            .setThumbnail('https://i.imgur.com/zlHASmr.png');
        serverData.forEach(({name, value, map}, index) => {
            if (index % 2 === 0 && index !== 0) {
                embed.addField("\u200b", "\u200b", false)
            }
            embed.addField(map, `
                
                    **Players** : ${value.rest.length > 0 ? value.rest : " **None** "}
                    
                    **Hostiles** : ${value.hostiles.length > 0 ? value.hostiles : " **None** "} 
                    
                    **Tribemates** : ${value.teammates.length > 0 ? value.teammates : " **None** "} 
                    
                    `, true)

        });
        return embed;
    }catch(err){
        throw err
    }
}

module.exports = scanCluster;
module.exports.Server = Server;
module.exports.Cluster = Cluster;
module.exports.createCluster = createCluster;
module.exports.getClusterInfo = getClusterInfo;


