const BaseCommand = require('../../utils/structures/BaseCommand');
const fetchConfigTextChannel = require("../../modules/functions/fetchConfigTextChannel");
const createChannel = require("../../modules/functions/createChannel");
const createChannelsFromConfig = require('../../modules/functions/createChannelsFromConfig');
const prodUrl = "https://jazzy-mousse-885ec4.netlify.app/?";
const devUrl = "http://localhost:3000/?";
const override = false;
const baseUrl = process.env.NODE_ENV === "production" || override ? prodUrl : devUrl;
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
    let option;
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
      createChannelsFromConfig(message,serverData.data,client);
      configChannel.delete();
    }
  }
}