/*
The Server class has no dependecies 
The Server class has no methods
The Server classes only responsibilites are to hold the port number, 
the game type and the host ip address
*/
const Server = require("../modules/Classes/Server.js");

describe("Server test block",()=>{
    let server;
    beforeEach(()=>{
        server = new Server(27015,"ARKSE","192.168.0.1");
    });
    describe("getPort",()=>{
        it("should return the port number",()=>{
            expect(server.port).toEqual(27015);
        })
    });   
    describe("getType",()=>{
        it("should return the game type",()=>{
            expect(server.type).toEqual("ARKSE");
        })
    });
    describe("getHost",()=>{
        it("should return the host ip address",()=>{
            expect(server.host).toEqual("192.168.0.1");
        })
    });
})