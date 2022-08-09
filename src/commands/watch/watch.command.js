const BaseCommand = require('../../utils/structures/BaseCommand');
const scanCluster = require("../../commands/main/scanCluster.js");
const {useCount} = require("../../modules/functions/useCount");

function handleTiming (watchDuration, userInterval) {
    let minuteToMillisecond = (t) => t * 60000;
    let timeToSeconds = (t) => t * 1000;
    let duration, interval;
    duration = minuteToMillisecond(watchDuration);
    interval = timeToSeconds(userInterval);
    return [duration, interval];
}
function makeCounterString(){
    let counter = 0;
    let timeToMinutes = (t) => t * 60;
    return (userInterval,watchDuration) => {
        return `Running Scan ${++counter} of ${Math.floor(timeToMinutes(watchDuration)/userInterval)}`;
    }
}



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
                let guildName = message.guild.name;
                await useCount(guildName, "watch");
                let isArkAlarmChannel = message.channel.name.includes("ark-alarm");
                let channel = message.channel;
                console.log(`Scanning initiated by channel ${message.guild.name}`);
                if (isArkAlarmChannel) {
                    let watchDuration =  args[0] || 1;
                    let userInterval = args[1] ||  15;
                    let [duration, interval] = handleTiming(watchDuration, userInterval);
                    let counter = makeCounterString();

                    let embed = await scanCluster(client, message);
                    let msgToEdit = await channel.send(embed);

                    let intervalID = setInterval(async () => {
                        console.log(`watch command running for channel: ${message.guild.name}`);
                        embed = (await scanCluster(client, message))
                        embed.setTitle(`${counter(userInterval,watchDuration)}`);
                        await msgToEdit.edit(embed);
                    }, interval);

                    setTimeout(async () => {
                        console.log("Clearing interval");
                        clearInterval(intervalID);
                        embed = (await scanCluster(client, message))
                        embed.setTitle(`Cluster Scan Complete`)
                        await msgToEdit.edit(embed);
                    }, duration);

                }
            }
        } catch (err) {
            throw err;
        }

    }
};

