const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require("fs");
const {getClusterName,removeItem,getClusterProperty} = require("../../modules/modules.js");



module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }

  async run(client, message, args) {
    // message.reply("test")
    // if(args[0] === "add"){
    //   if(args[1] === "tribe"){
    //     message.reply(args)
    //   }else if(args[1] === "enemies"){
    //     message.reply(args)
    //   }else{
    //     message.reply(args)
    //     let message = `When using the ${args[0]} command please only use "tribe" or "enemy"`
    //   }
    // }else if(args[0] === "remove"){
    //
    // }


  }
};
