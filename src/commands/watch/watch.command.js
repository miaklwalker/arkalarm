const BaseCommand = require('../../utils/structures/BaseCommand');
const scanCluster = require("../../commands/main/scanCluster.js");


module.exports = class WatchCommand extends BaseCommand {
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
                    // take t as num representing the number of minutes and convert that to milliseconds
                    let timeToMilliseconds = (t) => t * 60 * 1000;
                    // take t as num representing the number of seconds and convert that to milliseconds
                    let timeToSeconds = (t) => t * 1000;
                    // take t as num representing the number of milli and convert that to minutes
                    let timeToMinutes = (t) => t * 60;
                    let counter = 0;

                    let watchDuration =  args[0] || 1;
                    watchDuration = watchDuration < 15 ? 15 : watchDuration;
                    watchDuration = watchDuration > 1 ? watchDuration : 1;
                    watchDuration = timeToMilliseconds(watchDuration);

                    let userInterval = args[1] ||  15;
                    let intervalDuration = userInterval < 15 ? 15 : userInterval;
                    intervalDuration = timeToSeconds(intervalDuration);

                    let embed = await scanCluster(client, message);
                    let msgToEdit = await channel.send(embed);

                    let interval = setInterval(async () => {
                        console.log(`Scanning initiated by channel ${channel.name}`);
                        embed = (await scanCluster(client, message))
                        let counterString = Math.floor(timeToMinutes(watchDuration)/userInterval)
                        embed.setTitle(`Cluster Scan ${++counter} of ${counterString}`);
                        await msgToEdit.edit(embed);
                    }, intervalDuration);

                    setTimeout(async () => {
                        console.log("Clearing interval");
                        clearInterval(interval);
                        embed = (await scanCluster(client, message))
                        embed.setTitle(`Cluster Scan Complete`)
                        await msgToEdit.edit(embed);
                    }, watchDuration);

                }
            }
        } catch (err) {
            throw err;
        }

    }
};

