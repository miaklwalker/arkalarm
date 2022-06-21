const findChannelByName = require("./findChannelByName");
const createChannel = require("./createChannel");

const clusterName = (config) => (`ark-alarm-${config
    .replace(/ /g, '-')
    .toLowerCase()
}`);

module.exports =function useConfigToMakeArkAlarmChannels(message,config,client) {
    let validNames = Object.keys(config).map(name => clusterName(name));
    let channels = message.guild.channels.cache;
    channels.forEach(channel => {
        if(channel.type === "text" && channel.name.includes("ark-alarm") && !validNames.includes(channel.name)){
            channel.delete();
        }else if(channel.type === "text" && channel.name.includes("ark-alarm") && validNames.includes(channel.name)){
            validNames.splice(validNames.indexOf(channel.name),1);
        }
    });
    // valid names should now only contain channels that need to be created
    validNames.forEach(name => {
        createChannel(message, name, "text");
    })
  }