const findChannelByName = require("./findChannelByName");


module.exports = async function fetchConfigTextChannel (client) {
    let config = findChannelByName("config",client);
    if (config) {
      return config;
    }else{
      return false;
    }
  }