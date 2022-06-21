const Cluster = require("./Classes/cluster.js");
const fs = require("fs");




async function createCluster(message){
   const {FirebaseCrud} =  await import("./Classes/crudFirebase.mjs")
   let fbCrud = new FirebaseCrud("Users");
   let guildName, channelName;
   guildName = message.guild.name;
   channelName = message.channel.name.split("-")[2];
   let buffer =  await fbCrud.getFromDatabase(guildName);
   let config = buffer.data[channelName];
   let {game,ip,maps} = config;
   let cluster = new Cluster(game,ip);
   cluster.config = config;
   Object.values(maps).forEach(cluster.addServer);
   return cluster;
};

module.exports = createCluster;
