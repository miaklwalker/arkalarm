const Server = require("./Server.js");

class Cluster {
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

module.exports = Cluster;