module.exports = class Server {
    constructor(port,type,host){
        this.type = type;
        this.host = host;
        this.port = port;
    }
}