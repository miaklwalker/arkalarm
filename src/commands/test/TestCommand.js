const BaseCommand = require('../../utils/structures/BaseCommand');



module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }
  async run(client, message, args) {
    // send a message containing markdown
    message.channel.send('[test](https://www.google.com)');

  }
};

