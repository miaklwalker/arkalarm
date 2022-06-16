const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
let ip = require("ip");
const port = 8000;
const useConfigToMakeArkAlarmChannels = require("./modules/functions/createChannelsFromConfig");

let keys = {
    423334: {name: "Ark Alarm Test Server"}
}
let savedConfig = {};

app.use(cors());
app.use(express.json());

app.get("/:id", (req,res) => {
    let id = req.params.id;
    if(keys[id]){
        let buffer =  fs.readFileSync("./serverData.json");
        let name = keys[id].name;
        let config = JSON.parse(buffer)[name];
        res.json({data:config,name});
    }
})


app.post("/:id", async (req, res) => {
    let id = req.params.id;
    if(keys[id]){
        try{
            //message,config,client
            let name = keys[id].name;
            let buffer =  fs.readFileSync("./serverData.json");
            let config = JSON.parse(buffer);
            let data = req.body.data;
            let current = config[name];
            let newConfig = {...current,...data};
            let iterConfig = Object.entries(newConfig)
            iterConfig.forEach(([key,value]) => {
                let val = value.server.toLowerCase();
                if(key !== val){
                   newConfig[value.server.toLowerCase()] = value;
                   delete newConfig[key];
                }
            })
            config[name] = newConfig;
            fs.writeFileSync("./serverData.json",JSON.stringify(config,null,2));
            delete keys[id];
            let {message,client,channel} = savedConfig[name];
            useConfigToMakeArkAlarmChannels(message,newConfig,client);
            channel.delete();
        }catch(err){
            console.log(err);
        };
    }else{
        res.send("invalid key");
    }
})

app.listen(port,(e)=>{
    // get ip address
    console.log(`Server running on ${ip.address()}:${port}`);
    // get external ip address
    console.log(`External IP: ${ip.address()}`);
    console.log("port:",port);


})

exports.keys = keys;
exports.saved = savedConfig;