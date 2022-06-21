module.exports = function findChannelByName(name,client){
    // Gets all of the channels from Discord Server
    let target;
    if(client?.channels?.cache instanceof Map ) {
        client.channels.cache.forEach(channel => {
            if (channel.name === name) {
                target = channel;
            }
        });
    }
    if(target) {
        return target;
    }else{
        return false;
    }
}