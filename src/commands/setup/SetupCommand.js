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
          try {
              configMessage = JSON.parse(message.content);
          }catch (e){
              client.send("There was a problem with the JSON")
          }
      }
    });
    config.delete();
    return configMessage;
  }
}

function createChannel(message,name){
  return message.guild.channels.create(name, {type:"text"})
}

async function createConfig(message,config=configTemplate){
  let channel = await createChannel(message,"config","text");
  channel.send(config);

  channel.send(`
  Copy and Paste The above template, 
  When you are finished filling out the form use the ** !A setup **  
  command again to set up your bot!`);
}

const clusterName = (config) => (`ark-alarm-${config
    .replace(/ /g, '-')
    .toLowerCase()
}`);

class Result{
    constructor(reply,data){
        this.reply = reply;
        this.data = data;
    }
}

function parseLogic (client,message,option) {

    async function configEdit (serverData,config){
        createChannelsFromConfig(message,config,client);
        serverData[message.guild.name] = config;
        return new Result(true,serverData);
    }
    async function configGet (serverData){
        await createConfig(message, JSON.stringify(serverData[message.guild.name],null,2))
        return new Result(false,{});
    }
    async function configSave(){
        try{
            await createConfig(message)
            return new Result(false,{})
        }
        catch(err){

            console.log(err)
        }
    }
    async function configCreate(serverData,config){
        createChannelsFromConfig(message,config);
        serverData[message.guild.name] = config;
        return new Result(true,serverData)
    }

    let options = {
        configEdit,
        configGet,
        configSave,
        configCreate
    }

    return options[option]

}

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
  async run (client,message){
      // Get serverData.json
      fs.readFile("./serverData.json",async (err,data)=>{
          if(err)throw err;
          // Parse and save the serverData;
          let serverData = JSON.parse(data);

          let hasConfigFlag ,config, option;
          hasConfigFlag = serverData?.[message.guild.name];
          config = await fetchConfig(client);

          if(hasConfigFlag){
              if(config){
                  option = "configEdit"
              }else{
                  option = "configGet"
              }
          }
          else{
              if(config){
                  option = "configCreate"
              }else{
                  option = "configSave"
              }
          }

          let algorithm = parseLogic(client,message,option);
          let result = await algorithm(serverData,config);
          if(result?.reply){
            await fs.writeFile("./serverData.json",JSON.stringify(result["data"],null,2),console.log)
          }
      })
  }

};