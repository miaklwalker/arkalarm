// const BaseCommand = require('../../utils/structures/BaseCommand');
// const { keys, saved }  = require("../../server");
// const useConfigToMakeArkAlarmChannels = require("../../modules/functions/createChannelsFromConfig");
let config = {
  "Cluster Nickname": {
    server: "Replace With Cluster Name",
    ip: "xxx.xxx.xxx.xxx",
    game: "arkse",
    maps: {
      "The Island": "11111",
      "Scorched Earth": "",
      Aberation: "",
      "The Center": "",
      Ragnorak: "",
      Valguero: "",
      "Crystal Isle": "",
      Extinction: "",
      Genesis: ""
    },
    enemies: [],
    tribemates:[],
  }
};

// class Result{
//     constructor(reply,data){
//         this.reply = reply;
//         this.data = data;
//     }
// }

// function parseLogic (client,message,option) {

//     async function configEdit (serverData,config){
//         useConfigToMakeArkAlarmChannels(message,config,client);
//         serverData[message.guild.name] = config;
//         return new Result(true,serverData);
//     }
//     async function configGet (serverData){
//         await createConfigChannel(message, JSON.stringify(serverData[message.guild.name],null,2),client);
//         return new Result(false,{});
//     }
//     async function configSave(){
//         try{
//             await createConfigChannel(message,undefined,client);
//             return new Result(false,{})
//         }
//         catch(err){

//             console.log(err)
//         }
//     }
//     async function configCreate(serverData,config){
//         useConfigToMakeArkAlarmChannels(message,config,client);
//         serverData[message.guild.name] = config;
//         return new Result(true,serverData)
//     }

//     let options = {
//         configEdit,
//         configGet,
//         configSave,
//         configCreate
//     }

//     return options[option]

// }

// module.exports = class SetupCommand extends BaseCommand {
//   constructor() {
//     super('setup', 'setup', []);
//   }
//   async run (client,message){
//       // Get serverData.json

//       fs.readFile("./serverData.json",async (err,data)=>{
//           if(err)throw err;
//           // Parse and save the serverData;
//           let serverData = JSON.parse(data);

//           let clientHasConfig ,config, option;
//           clientHasConfig = serverData?.[message.guild.name];
//           config = await fetchConfig(client);

//           if(clientHasConfig){
//               if(config){
//                   option = "configEdit"
//               }else{
//                   option = "configGet"
//               }
//           }
//           else{
//               if(config){
//                   option = "configCreate"
//               }else{
//                   option = "configSave"
//               }
//           }

//           let algorithm = parseLogic(client,message,option);
//           let result = await algorithm(serverData,config);
//           if(result?.reply){
//             await fs.writeFile("./serverData.json",JSON.stringify(result["data"],null,2),console.log)
//           }
//       })
//   }

// };
const BaseCommand = require('../../utils/structures/BaseCommand');
const fetchConfigTextChannel = require("../../modules/functions/fetchConfig");
const createChannel = require("../../modules/functions/createChannel");
const prodUrl = "https://jazzy-mousse-885ec4.netlify.app/?";
const devUrl = "http://localhost:3000/?";
const override = false;
const baseUrl = process.env.NODE_ENV === "production" || override ? prodUrl : devUrl;
const makeMsg = (address) => (`
use the following link to set up your bot: ${address}
once you have done this, you can use the ** !A setup ** to see your new setup!
run the ** !A setup ** command again to finish!
`)

module.exports = class SetupCommand extends BaseCommand {
  constructor() {
    super('setup', 'setup', []);
    this.userCrud = null;
    this.keyCrud = null;
    this.init();
  }
  async init(){
    const {FirebaseCrud,KeyCrud} = await import('../../modules/Classes/crudFirebase.mjs');
    this.userCrud = new FirebaseCrud('Users');
    this.keyCrud = new KeyCrud("Keys");
  }
  async makeConfig(client,message,config){
    let name = message.guild.name;
    let key = await this.keyCrud.AddToDatabase(name);
    await this.userCrud.AddToDatabase(name,config);
    return key;
  }
  async makeKey (message) {
    let name = message.guild.name;
    let key = await this.keyCrud.AddToDatabase(name);
    return key;
  }
  async makeConfigChannel(message,msg){
    let channel = await createChannel(message,"config","text");
    channel.send(msg);
  }
  async run (client,message){
    let serverName = message.guild.name;
    let serverData = await this.userCrud.getFromDatabase(serverName);
    let configChannel = await fetchConfigTextChannel(client);
    console.log(serverData ? "Server Data Exists" : "Server Data Does Not Exist");
    console.log(configChannel ? "config channel exists" : "config channel does not exist");
    let option;
    // choose option
    if(serverData){
      // the user has a config;
      if(configChannel){
        // the user has a config and a config channel;
        option = "close";
      }else{
        // the user has a config but no config channel;
        option = "makeConfigChannel";
      }
    }else{     
        // the user has no config and no config channel;
        option = "makeConfigChannelandConfig";
    }

    if(option === "makeConfigChannelandConfig"){
      this.makeConfig(client,message,config)
      .then(key=>{
        let msg = makeMsg(baseUrl+key);
        this.makeConfigChannel(message,msg);
      });
    }
    if(option === "makeConfigChannel"){
      this.makeConfigChannel(message,makeMsg(baseUrl+await this.makeKey(message)));
    }
    if(option === "close"){
      configChannel.delete();
    }
  }
}