const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const fs = require("fs");



async function fetchConfig(client){
  let values = Object.values(client.channels);
  let channels = values[1] instanceof values[0] && values[1];
  let config;
  channels.forEach(channel=>{
    if(channel.name === "config"){
      config = channel;
    }
  })
  if(config){
    let configMessage;
    let messages =  await config.messages.fetch();
    messages.forEach(message=>{
      let firstLetter = message.content[0];
      if(firstLetter === "{" && !message.author.bot){
        configMessage = JSON.parse(message.content);
      }
    })
    config.delete();
    return configMessage;
  }
}

function createChannel(message,name,type){
  return message.guild.channels.create(name, {type})
}

async function createConfig(message){
  let configTemplate = `{
  "Cluster Nickname": {
    "server": "Replace With Cluster Name",
    "ip": "xxx.xxx.xxx.xxx",
    "game": "arkse",
    "maps": {
      "The Island": "replace these with the maps query port",
      "Scorched Earth": "",
      "Aberation": "",
      "The Center": "",
      "Ragnorak": "",
      "Valguero": "",
      "Crystal Isle": "",
      "Extinction": "",
      "Genesis": ""
    },
    "homebase": "",
    "enemies": [],
    "tribe": {
      "name": "",
      "mainmap": "",
      "members": []
    }
  }
}`;
  let channel = await createChannel(message,"config","text")
  channel.send(configTemplate);

  channel.send(`
        Copy and Paste The above template, When you are finished filling out the form use the ** !A config **  command again to set up your bot! 
        `)
}

const clusterName = (config) => `ark-alarm-${Object.keys(config)[0].replace(/ /g, '-').toLowerCase()}`;


module.exports = class SetupCommand extends BaseCommand {
  constructor() {
    super('setup', 'setup', []);
  }

  async run(client, message, args) {
    // Gets and reads the server data json file
    fs.readFile("./serverData.json",async (err,data) =>{
      if(err)throw err;
      let serverData = JSON.parse(data);

      if(serverData?.[message.guild.name]){
        // If the discord server already has a config file
        let config = await fetchConfig(client);
        if(config){
          // If they are editing the current config file
          let serverName = message.guild.name;
          createChannel(message,clusterName(config),"text");
          serverData[message.guild.name] = config;
          fs.writeFile("./serverData.json",JSON.stringify(serverData,null,2),console.log)
        }else{
          // If they are wanting to edit the current config file
          let configChannel = await createChannel(message,"config","text");
          configChannel.send(JSON.stringify(serverData[message.guild.name]))
        }
      }else{
        // If this is first time setup
        let config = await fetchConfig(client);
        if(config){
          let serverName = message.guild.name;
          createChannel(message,clusterName(config),"text");
          serverData[message.guild.name] = config;
          fs.writeFile("./serverData.json",JSON.stringify(serverData,null,2),()=>{
            console.log("data written");
          })
        }
        else{
          // Saving the data from the first time setup
          createConfig(message)
              .then(console.log)
              .catch(console.error)
        }
      }
    })
  }
}