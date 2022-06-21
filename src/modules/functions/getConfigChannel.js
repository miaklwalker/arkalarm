module.exports = async function fetchConfigTextChannel (client) {
    let config = await findChannelByName(client, "config");
    if (config) {
      return config;
    }else{
      return false;
    }
  }