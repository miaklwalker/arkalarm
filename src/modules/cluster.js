const Server = require("./Server.js");
module.exports =class Cluster {
    clusterInfo;
    config;
    constructor(type,host) {
        this.type = type;
        this.host = host;
        this._servers = [];
    }
    get servers(){
        return this._servers;
    }
    addServer=(port)=>{
        this._servers.push(new Server(port,this.type,this.host));
    }
}

