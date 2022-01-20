const getClusterName = (channelName) => {
    const [,,...rest] = channelName.split("-");
    return rest;
}
module.exports.getClusterName = getClusterName;

module.exports.removeItem = (item,array) =>{
    if(array.includes(item) && typeof item === "string"){
        array.splice(array.indexOf(item),1)
    }
    return array;
}

module.exports.getClusterProperty = (message,serverData,property= undefined) => (
    property ?
        serverData[message.guild.name][getClusterName(message.channel.name)[0]][property] :
        serverData[message.guild.name][getClusterName(message.channel.name)[0]]
);


// tribe tracker 
/*
add enemy tribes
 add tribe members
 exclude 123's 

*/