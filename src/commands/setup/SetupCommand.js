const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require("fs");

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
     tribemates:[],
  }
}`;


function findChannelByName(name,client){
    // Gets all of the channels from Discord Server
    let target;
    // Goes through each channel and finds the config channel
    if(client?.channels?.cache instanceof Map ) {
        client.channels.cache.forEach(channel => {
            if (channel.name === name) {
                target = channel;
            }
        });
    }
    if(target) {
        return target;
    }
}

async function fetchConfig(client){
  let config = findChannelByName("config",client);
  if(config){
    let configMessage;
    let messages =  await config.messages.fetch();
    messages.forEach(message=>{
      let firstLetter = message.content[0];
      if(firstLetter === "{" && !message.author.bot){
        configMessage = JSON.parse(message.content);
      }
    });
    config.delete();
    return configMessage;
  }
}

function createChannel(message,name){
  return message.guild.channels.create(name, {type:"text"})
}

async function createConfig(message){
  let channel = await createChannel(message,"config","text");
  channel.send(configTemplate);

  channel.send(`
  Copy and Paste The above template, 
  When you are finished filling out the form use the ** !A config **  
  command again to set up your bot!`);
}

const clusterName = (config) => (`ark-alarm-${config
    .replace(/ /g, '-')
    .toLowerCase()
}`);

function createChannelsFromConfig(message,config,client) {
  Object.keys(config).forEach(name => {
    if (name && !findChannelByName(clusterName(name),client)) {
      createChannel(message, clusterName(name), "text")
    }
  });
}

module.exports = class SetupCommand extends BaseCommand {
  constructor() {
    super('setup', 'setup', []);
  }
  async run(client, message) {
    // Gets and reads the server data json file
    fs.readFile(
        "./serverData.json",
        async (err,data) =>{
          if(err)throw err;
          let serverData = JSON.parse(data);
          let hasConfigFile = serverData?.[message.guild.name];
          if(hasConfigFile){
            // If the discord server already has a config file
            // We fetch that file
            let config = await fetchConfig(client);
            if(config){
            // If they are editing the current config file
              createChannelsFromConfig(message,config,client);
              serverData[message.guild.name] = config;
              fs.writeFile(
                "./serverData.json",
                JSON.stringify(serverData,null,2)),
                  console.log
          }
            else{
            // If they are wanting to edit the current config file
            let configChannel = await createChannel(
                message,
                "config",
                "text"
            );
            configChannel.send(
              JSON.stringify(serverData[message.guild.name])
            );
            configChannel.send(`
            Copy and Paste The above template, 
            When you are finished making your changes use the ** !A config **  
            command again to set up your bot!`);
          }
          }
          else{
            // If this is first time setup
            let config = await fetchConfig(client);
            if(config){
              createChannelsFromConfig(message,config);
              serverData[message.guild.name] = config;
              fs.writeFile(
                  "./serverData.json",
                  JSON.stringify(serverData,null,2),
                  console.log
              )
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
};