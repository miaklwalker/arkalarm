const fs = require("fs");
module.exports = async function fetchConfigWithCallback(name,fileSys=fs,callback){
    await fileSys.readFile("./serverData.json",(err,data)=>{
        if(err)throw err;
        let res = JSON.parse(data);
        if(res[name]){
            callback(res[name]);
        }
    })
}