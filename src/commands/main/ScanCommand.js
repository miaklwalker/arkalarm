const BaseCommand = require('../../utils/structures/BaseCommand');
const scanCluster = require("./scanCluster.js");
const {useCount} = require("../../modules/functions/useCount");

module.exports = class ScanCommand extends BaseCommand {
    constructor() {
        super('', 'main', []);
    }

    async run(client, message, args) {
        try {
            await message.channel.send(
                await scanCluster(client, message)
            )
            let guildName = message.guild.name;
            await useCount(guildName, "Scan");
        } catch (err) {
            throw err;
        }
    };
};
