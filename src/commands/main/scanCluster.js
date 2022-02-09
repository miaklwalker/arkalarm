const Discord = require('discord.js');
const Gamedig = require("gamedig");
const createCluster = require("../../modules/createCluster.js");
const filterPlayers = require("../../modules/functions/filterPlayer.js");



async function getClusterInfo(message,api=Gamedig){
    let cluster = createCluster(message);
    let clusterInfo = [];
    for(let server of cluster.servers) {
        try {
            // Get server info from the steam api
            let {players: p, name, map, raw: {numplayers}} = await api.query(server);
            // filter out the random empty player objects
            let players = p.map(obj => obj.name).filter(name => name !== undefined);

            clusterInfo.push({name, map, numplayers, players});

        } catch (err) {
            //Allow the bot to continue if the server is offline
        }
    }
    cluster.clusterInfo = clusterInfo;
    return cluster;
}

async function scanCluster (client, message){
    try{
    let cluster = await getClusterInfo(message);
    let playerData = filterPlayers(cluster);
    let serverData = cluster.clusterInfo.map((server,index)=>{
        return {
            map:server.map,
            name:server.name,
            value:playerData[index],
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
    serverData.forEach(({name,value,map},index)=>{
        if(index%2===0 && index !== 0){
            embed.addField("\u200b","\u200b",false)
        }
        embed.addField(map,`
                
                    **Players** : ${value.rest.length > 0 ? value.rest : " **None** "}
                    
                    **Hostiles** : ${value.hostiles.length > 0 ? value.hostiles : " **None** " } 
                    
                    **Tribemates** : ${value.teammates.length > 0 ? value.teammates : " **None** " } 
                    
                    `,true)

    });
    return embed;
    }catch(err){
    //console.error(err)
    }
}

module.exports = scanCluster;
module.exports.getClusterInfo = getClusterInfo;


