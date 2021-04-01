const Discord = require('discord.js');
const fs = require("fs");
const Gamedig = require("gamedig");

class Server {
    constructor(port,type,host){
        this.type = type;
        this.host = host;
        this.port = port;
    }
}

class Cluster {
    clusterInfo;
    config;
    constructor(type,host) {
        this.type = type;
        this.host = host;
        this._servers = [];
    }
    get servers(){
        return this._servers;
    }
    addServer=(port)=>{
        this._servers.push(new Server(port,this.type,this.host));
    }
}

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
                return (
                    !enemies.map(enemy => enemy !== player).includes(true) &&
                    !tribemates.map(tribemates => tribemates !== player).includes(true))
            })
        };
        serverInfo.push(serverData);
    }
    return serverInfo
}
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

        } catch (err) {console.log(err)}
    }
    cluster.clusterInfo = clusterInfo;
    return cluster;
}

async function scanCluster (client, message){
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
}

module.exports = scanCluster;
module.exports.Server = Server;
module.exports.Cluster = Cluster;
module.exports.filterPlayer = filterPlayers;
module.exports.createCluster = createCluster;
module.exports.getClusterInfo = getClusterInfo;


