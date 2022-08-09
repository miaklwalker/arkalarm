const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');


module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super('help', 'help', []);
    }
    async run(client, message, args) {
        const messages = {
            scan:"The main functionality of the app " +
                 "This has to be run from an 'ark-alarm' channel " +
                "When this command is run from the correct channel "+
                "The bot will scan the cluster and send a message to the channel ",

            setup:"This command is used to configure the bot " +
                "This command generates the link to the page where the bot can be configured " +
                "Once you have finished on the web page come back to the discord and run the setup command again ",

            watch:"This command allows the user to easily watch the cluster once the bot is set up. " +
                "This will be a premium feature in the future but is currently free but will be limited or paid in the future. " +
                "The syntax for the command is `!A watch <duration> <interval>`.  for example  `!A watch 1 15` "+
                "meaning the bot will scan the cluster every 15 seconds for 1 minute ",
            help:[{ name: 'help Command', value: '!A help' },
                { name: 'Scan Command', value: '!A help scan' },
                { name: 'Config Command', value: '!A help setup' },
                { name: 'Watch Command', value: '!A help watch' }]



        }
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help Menu')
            .setDescription('This is the help menu for the bot')
            let arg = args[0];
            switch (arg) {
                case "scan":
                    embed.addField('Scan Command : !A', messages.scan)
                    break;
                case "setup"  :
                    embed.addField("Setup Command : !A setup", messages.setup)
                    break;
                case "watch":
                    embed.addField("Watch Commands : !A watch <duration> <interval> ", messages.watch)
                    break;
                default:
                    messages.help.forEach(({name,value}) => embed.addField(name, value))
                    break;
            }
            embed.setFooter('Made by: miaklwalker#8366');
            message.channel.send(embed);

    }
};

