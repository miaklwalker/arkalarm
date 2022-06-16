const findChannelByName = require("./findChannelByName");
const createChannel = require("./createChannel");

const clusterName = (config) => (`ark-alarm-${config
    .replace(/ /g, '-')
    .toLowerCase()
}`);

module.exports =function useConfigToMakeArkAlarmChannels(message,config,client) {
    // here we are creating the channels from the config;
    Object.keys(config).forEach(name => {
      if (!findChannelByName(clusterName(name),client)) {
        createChannel(message, clusterName(name), "text")
      }
    });
    // here we clean up the old channels that are not in the config;
    message.guild.channels.cache.forEach(channel => {
        if(channel.type === "text" && channel.name.includes("ark-alarm")){
          let cName = channel.name.replace("ark-alarm-","").replace("-"," ");
          let inConfig = Object
          .keys(config)
          .map(name => name.toLowerCase() === cName.toLowerCase())
          .includes(true);
          if(!inConfig){
            channel.delete();
          }
        }
    });
  }