const filterPlayers = require("../modules/functions/filterPlayer.js")

describe("Filter Player Spec",()=>{
    // What do i need to test the functionality
    // a cluster cluster info , enmeies , tribamates
    // cluster info === [{players}]
    // players === [{name}]
    let testCluster = {
        clusterInfo:[
            {map:"",players:["frank","hank hill","yasuo"]},
            {map:"",players:["jordan","simba","123king"]},
            {map:"",players:["jake","mufasa","69killer"]},
            {map:"",players:["josh","scar","jeremy"]},
            {map:"",players:["vex","kingkale","fasde"]},
            {map:"",players:["jeremy","sydney","ravenmaven"]},
            {map:"",players:["","cassie","blockchain"]},
            {map:"",players:["lukas","brandon","strainer"]},
            {map:"",players:["henry","braum","collander"]},
        ],
        config:{
            enemies:["frank","josh","jeremy"],
            tribemates:["vex","cassie","hank hill"]
        }
    };
    let results = [
        {hostiles:["frank"],teammates:["hank hill"],rest:["yasuo"]},
        {hostiles:[],teammates:[],rest:["jordan","simba","123king"]},
        {hostiles:[],teammates:[],rest:["jake","mufasa","69killer"]},
        {hostiles:["josh","jeremy"],teammates:[],rest:["scar"]},
        {hostiles:[],teammates:["vex"],rest:["kingkale","fasde"]},
        {hostiles:["jeremy",],teammates:[],rest:["sydney","ravenmaven"]},
        {hostiles:[],teammates:["cassie",],rest:["blockchain"]},
        {hostiles:[],teammates:[],rest:["lukas","brandon","strainer"]},
        {hostiles:[],teammates:[],rest:["henry","braum","collander"]},

    ]
    it("should when passed a server filter players into specific catagories",()=>{
            expect(filterPlayers(testCluster)).toEqual(results)
    })
})