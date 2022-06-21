/*
The createCluster function has a dependecy on fs and Cluster
It is an exported function that when passed a message object, 
and a file system object, returns a Cluster object

The message is parsed to get the guild name and channel name
The channel name is split to get the server id 
The server id is used to get the server config from the serverData.json file
The server config is parsed to get the game type, ip address and maps
The game type, ip address and maps are used to create a new Cluster object
Then we iterate over the maps object and add the servers to the cluster
The cluster object is returned
*/
const createCluster = require("../modules/createCluster.js");
describe("createCluster Test bloock",()=>{
    //first we need to mock the fs module
    //It needs to return some mock server data
    let mockFS = jest.fn((path)=>{
        if(path === "./serverData.json"){
            return JSON.stringify({
                "testGuild":{
                        "bg": {
                        "server": "Bearded Gamer",
                        "ip": "192.168.0.1",
                        "game": "arkse",
                        "maps": {
                          "The Island": "27019",
                          "Aberation": "27023",
                          "The Center": "27017",
                          "Ragnorak": "27015",
                          "Valguero": "27021",
                          "Crystal Isle": "27033",
                          "Extinction": "27025",
                          "Genesis": "27029"
                        },
                        "enemies": [],
                        "tribemates": []
                    }
                }
            });
        }
    });
    let message = {
        guild: {
            name: "testGuild"
        },
        channel: {
            name: "ark-alarm-bg"
        }
    };
    const mockedModule = {
        readFileSync: mockFS
    }
    it("should return a cluster object",()=>{
        let cluster = createCluster(message,mockedModule);
        expect(cluster).toBeInstanceOf(Object);
    });
    it("should return a cluster object with the correct game type",()=>{
        let cluster = createCluster(message,mockedModule);
        expect(cluster.type).toBe("arkse");
    });
    it("should return a cluster object with the correct maps",()=>{
        let cluster = createCluster(message,mockedModule);
        expect(cluster._servers).toHaveLength(8);
    });
});