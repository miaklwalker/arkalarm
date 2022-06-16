module.exports = function createChannel(message,name){
    return message.guild.channels.create(name, {type:"text"})
  }