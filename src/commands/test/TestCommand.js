const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const fs = require("fs");
const Gamedig = require("gamedig");


async function createEmbed () {
    return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Cluster Scan')
        .setURL('https://discord.js.org/')
        .setAuthor('Ark Alarm', 'https://i.imgur.com/zlHASmr.png', 'https://discord.js.org')
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/zlHASmr.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/zlHASmr.png')
        .setTimestamp()
        .setFooter('Ark Alarm - Michael Walker - 2020', 'https://imgur.com/zlHASmr');

}

class Server {
    constructor(port,type,host){
        this.type = type;
        this.host = host;
        this.port = port;
    }
}

class Cluster {
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

function createCluster(message){
    let guildName,channelName;
    guildName = message.guild.name;
    channelName = message.channel.name;
    let {game,ip,maps,enemies} = JSON.parse(fs.readFileSync("./serverData.json"))[guildName][channelName.split("-")[2]];
    let cluster = new Cluster(game,ip);
    Object.values(maps).forEach(cluster.addServer);
    return cluster;
}
async function getClusterInfo(message){
    let cluster = createCluster(message);
    let clusterInfo = [];
    for(let server of cluster.servers) {
        try {
            // Get server info from the steam api
            let {players: p, name, map, raw: {numplayers}} = await Gamedig.query(server);
            // filter out the random empty player objects
            let players = p.map(obj => obj.name).filter(name => name !== undefined);

            let serverOutput = {name, map, numplayers, players};
            clusterInfo.push(serverOutput);

        } catch (err) {
            console.log(err)
        }
    }
    return clusterInfo;
}

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('', 'testing', []);
  }

  async run(client, message, args) {
    let clusterInfo = await getClusterInfo(message);
    let serverData = clusterInfo.map(server=>{
        return {
            map:server.map,
            name:server.name,
            value:server.players.filter(name=>name!==""),
        }
    })
      let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Cluster Scan')
            .setAuthor('Ark Alarm', 'https://i.imgur.com/zlHASmr.png', 'https://discord.js.org')
            .setDescription('Here is your report on the cluster')
            .setTimestamp()
            .setFooter('Ark Alarm - Michael Walker - 2020', 'https://imgur.com/zlHASmr');
            serverData.forEach(({name,value,map},index)=>{
                if(index%2===0 && index !== 0){
                    embed.addField("\u200b","\u200b",false)
                }
                embed.addField(map,`
                
                    **Players** : ${value.length > 0 ? value : "This server is empty"}
                    
                    **Hostiles** : There are no hostiles
                    
                    **Tribemates** : There are no Tribemates
                    
                    `,true)

            })
          // .setThumbnail('https://i.imgur.com/zlHASmr.png')
          // .addField('Inline field title', 'Some value here', true)
          // .setImage('https://i.imgur.com/zlHASmr.png')

      message.channel.send(embed);

  }
}
