const BaseCommand = require('../../utils/structures/BaseCommand');
const dotenv = require("dotenv").config();
const Discord = require('discord.js');





module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }

  async run(client, message, args) {

  }
};
