
const {createCluster,Cluster} = require("../commands/main/scanCluster.js");

describe("Test Block for the scan cluster function",()=>{
    describe("getClusterInfo",()=>{
    });
    describe("createCluster",()=>{
        let message = {
            guild:{
                name:"Ark Alarm Test Server"
            },
            channel:{
                name:"ark-alarm-agb"
            }

        };
        let fileSys = {
            readFileSync:jest.fn(()=> {
                let mess = {
                    "Ark Alarm Test Server": {
                        "agb": {
                            "server": "AGB",
                            "ip": "74.208.129.118",
                            "game": "arkse",
                            "maps": {
                                "The Island": "29200",
                                "Scorched Earth": "29300",
                                "Aberation": "29000",
                                "The Center": "29050",
                                "Ragnorak": "29250",
                                "Valguero": "29350",
                                "Crystal Isle": "29056",
                                "Extinction": "29100",
                                "Genesis": "29150",
                                "Fjorder": "29360",
                                "Fjordor pvp": "29260",
                                "valhalla": "29160"
                            },
                            "enemies": [
                                "Groovy"
                            ],
                            "tribemates": [
                                "Vex",
                                "Haze5500"
                            ]
                        }
                    }
                };
                return JSON.stringify(mess);
            })
        };
        let result = createCluster(message,fileSys);
        it('should create and return a cluster',
            () => {
            expect(result).toBeInstanceOf(Cluster)
        }
        );
    });
});