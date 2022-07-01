const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const dotenv = require("dotenv").config();
const client = new Client();



(async () => {
  let token = process.env.NODE_ENV === 'production' ?
  process.env.DISC_TOKEN_PROD :
  process.env.DISC_TOKEN_DEV ;

  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;

  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(token);

})();


