const BaseCommand = require('../../utils/structures/BaseCommand');
const { getClusterInfo } = require('../main/scanCluster');


module.exports = class ScanCommand extends BaseCommand {
    constructor() {
        super('add', '', []);
    }

    async run(client, message, args) {
        try{
            // first get the tribe config from the database
            let serverData = await getClusterInfo(message);
            console.log(serverData);
            //console.log(message);
        }catch(err){
            console.log(err)
        }
    };
};