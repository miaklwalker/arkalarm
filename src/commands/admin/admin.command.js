const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require("fs");

let adminList = [
    "miaklwalker#8366"
]
const version = "0.1.0";
console.log("v " + version);

module.exports = class AdminCommand extends BaseCommand {
    constructor() {
        super('admin', 'admin function', []);
    }
    makeUserName(username, discriminator) {
        return username + "#" + discriminator;
    }
    async run(client, message, args) {
        let subCommand = args[0];
        switch (subCommand) {
            case "-u":
            case "usage":
                let user = message.author;
                let userName = this.makeUserName(user.username, user.discriminator);
                if (adminList.includes(userName)) {
                    let data = JSON.parse(fs.readFileSync("./useCount.json").toString());
                    let res = JSON.stringify(data,null,2);
                    message.channel.send(res);
                }
                break;
            case "-v":
            case "version":
                message.channel.send(`Version: ${version}`);
                break;
            default :
                message.channel.send("Use either `usage` or `version` as your subcommand");
        }

    }
};
