const BaseCommand = require('../../utils/structures/BaseCommand');
const scanCluster = require("../../commands/main/scanCluster.js");


module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('watch', 'testing', []);
  }
    makeUserName(username, discriminator) {
        return username + "#" + discriminator;
    }
  async run(client, message, args) {
    try {
        let user = message.author;
        let userName = this.makeUserName(user.username, user.discriminator);
        if ( userName === "miaklwalker#8366") {
            let isArkAlarmChannel = message.channel.name.includes("ark-alarm");
            let channel = message.channel;

            if (isArkAlarmChannel) {
                let time = args[0] || 5;
                let timeInMilliseconds = (time) => time * 60 * 1000;

                let embed = await scanCluster(client, message);
                let msgToEdit = await channel.send(embed);

                let interval = setInterval(async () => {
                    console.log(`Scanning initiated by channel ${channel.name}`);
                    embed = (await scanCluster(client, message))
                    await msgToEdit.edit(embed);
                }, 1000 * 30);

                setTimeout(() => {
                    console.log("Clearing interval");
                    clearInterval(interval);
                }, timeInMilliseconds(time));

            }
        }
    } catch (err) {
        throw err;
    }

  }
};

