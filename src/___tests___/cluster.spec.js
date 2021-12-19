/*
Cluster has a dependecny of the Server class
Cluster is responsible for holding all of the servers 
as well as the the game type and the host ip address

We have two functions to test.

The get servers function which returns the servers as an array 

and the addServer function which pushes a new server to the server list 
with the port number and the game type and host ip address
*/
const Cluster = require("../modules/Classes/Cluster.js");

describe("Test Block for the scan cluster function",()=>{
    let cluster;
    beforeEach(()=>{
        cluster = new Cluster("ARKSE","192.168.0.1");
    })
    describe("get Servers",()=>{
        it("should return an array of servers",()=>{
            expect(cluster.servers).toEqual([]);
        })
    })
    describe("addServer",()=>{
        it("should add a server to the servers array",()=>{
            cluster.addServer(27015);
            expect(cluster.servers)
            .toEqual([{port:27015,type:"ARKSE",host:"192.168.0.1"}]);
        })
    });
});