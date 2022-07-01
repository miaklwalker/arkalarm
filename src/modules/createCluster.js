const Cluster = require("./Classes/cluster.js");
const fs = require("fs");
const keys = require("./globals.js");





async function getInfoFromFirebase(guildName){
   const {FirebaseCrud} =  await import("./Classes/crudFirebase.mjs");
   let fbCrud = new FirebaseCrud("Users");
   let res =  await fbCrud.getFromDatabase(guildName);
   return res.data;
}


async function createCluster(message){
   let guildName, channelName;
   guildName = message.guild.name;
   channelName = message.channel.name.split("-")[2];
   let buffer = await getInfoFromFirebase(guildName);
   let config = buffer[channelName];
   let {game,ip,maps} = config;
   let cluster = new Cluster(game,ip);
   cluster.config = config;
   Object.values(maps).forEach(cluster.addServer);
   return cluster;
};

module.exports = createCluster;
