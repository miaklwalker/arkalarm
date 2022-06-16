const BaseCommand = require('../../utils/structures/BaseCommand');
const { keys, saved }  = require("../../server");
const useConfigToMakeArkAlarmChannels = require("../../modules/functions/createChannelsFromConfig");
const fetchConfigTextChannel = require("../../modules/functions/fetchConfig");
const createChannel = require("../../modules/functions/createChannel");
const random = require("another-random-package");
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

async function fetchConfig(client){
  // this function tries to find a text Channel called config
  let configChannel = await fetchConfigTextChannel(client);
  if(configChannel){
    console.log(configChannel);
    let configMessage;
    let messages =  await configChannel.messages.fetch();
    messages.forEach(message=>{
      let firstLetter = message.content[0];
      if(firstLetter === "{"){
          try {
              configMessage = JSON.parse(message.content);
          }catch (e){
              client.send("There was a problem with the JSON")
          }
      } 
      // if its a bot and the message the last message is json;    
    });
    configChannel.delete();
    return configMessage;
  }
}



async function createConfigChannel(message,config=configTemplate,client){
  if(config === undefined){
    config = configTemplate;
  }
  let channel = await createChannel(message,"config","text");
  channel.send(config);
  const key = {
    name: message.guild.name,
    configKey : random.randomStringAlphaNumeric(10),
  }
  keys[key.configKey] = {name:key.name};
  let address = "http://localhost:3000/?"+key.configKey;
  saved[key.name] = {channel,message,client};

  channel.send(`
  Copy and Paste The above template, 
  When you are finished filling out the form use the ** !A setup **  
  command again to set up your bot!
  
  You can also use the following link to set up your bot:
  ${address}
  once you have done this, you can use the ** !A setup ** to see your new setup!
  run the ** !A setup ** command again to finish!
  `);
}



class Result{
    constructor(reply,data){
        this.reply = reply;
        this.data = data;
    }
}

function parseLogic (client,message,option) {

    async function configEdit (serverData,config){
        useConfigToMakeArkAlarmChannels(message,config,client);
        serverData[message.guild.name] = config;
        return new Result(true,serverData);
    }
    async function configGet (serverData){
        await createConfigChannel(message, JSON.stringify(serverData[message.guild.name],null,2),client);
        return new Result(false,{});
    }
    async function configSave(){
        try{
            await createConfigChannel(message,undefined,client);
            return new Result(false,{})
        }
        catch(err){

            console.log(err)
        }
    }
    async function configCreate(serverData,config){
        useConfigToMakeArkAlarmChannels(message,config,client);
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

          let clientHasConfig ,config, option;
          clientHasConfig = serverData?.[message.guild.name];
          config = await fetchConfig(client);

          if(clientHasConfig){
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