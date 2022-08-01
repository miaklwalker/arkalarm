const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require("fs");
const {getClusterName,removeItem,getClusterProperty} = require("../../modules/modules.js");

let adminList = [
    "miaklwalker#8366"
]

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('admin', 'testing', []);
  }
  makeUserName(username, discriminator) {
    return username + "#" + discriminator;
  }
  async run(client, message, args) {
    let user = message.author;
    let userName = this.makeUserName(user.username, user.discriminator);
    if (adminList.includes(userName)) {
      let data = JSON.parse(fs.readFileSync("./useCount.json").toString());
      let res = JSON.stringify(data,null,2);
      message.channel.send(res);
    }
  }
};
