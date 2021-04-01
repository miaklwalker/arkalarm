const BaseCommand = require('../../utils/structures/BaseCommand');
const scanCluster = require("./scanCluster.js");

module.exports = class ScanCommand extends BaseCommand {
  constructor() {
    super('', 'main', []);
  }

  async run(client, message, args) {
   await message.channel.send(
       await scanCluster(client,message)
   )
  }
};
