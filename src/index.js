
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const dotenv = require("dotenv").config();
const client = new Client();

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.NODE_ENV === "dev" ?
      process.env.DISC_TOKEN_DEV   :
      process.env.DISC_TOKEN_PROD );
})();

