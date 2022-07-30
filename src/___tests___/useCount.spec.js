const {useCount,useCountAsync} = require('../modules/functions/useCount');

describe("useCount", () => {
    let fs
    let useCount;
    beforeAll(() => {
        useCount = {}
        fs = {
            readFileSync: jest.fn(()=>{
                return "{}"
            }),
            writeFileSync: jest.fn((path,data)=>{
                useCount = data
            }),
            readFile: jest.fn(async(path,cb)=>{
               await cb(null,JSON.stringify(useCount))
            }),
            writeFile: jest.fn((path,data)=>{
                useCount = data
            })
        }
    })
    describe("useCount",()=>{
        it("should Call The Sync read file",()=>{
            useCount("ArkAlarmTestServer","Scan",fs)
            expect((fs.readFileSync)).toHaveBeenCalled();
        })
        it("should Call The Sync write file",()=>{
            useCount("ArkAlarmTestServer","Scan",fs)
            expect((fs.writeFileSync)).toHaveBeenCalled();
        })
        it("should correctly increment the counter",()=>{
            useCount("ArkAlarmTestServer","Scan",fs)
            expect(this.useCount).toEqual('{"ArkAlarmTestServer":{"Scan":1}}');
        })
    })
    describe("useCountAsync",()=>{
        it("should Call The Async read file",()=>{
            useCountAsync("ArkAlarmTestServer","Scan",fs)
            expect(fs.readFile).toHaveBeenCalled();
        })
        it("should Call The Async write file",()=>{
            useCountAsync("ArkAlarmTestServer","Scan",fs)
            expect(fs.writeFile).toHaveBeenCalled();
        })
        it("should correctly increment the counter",()=>{
            useCountAsync("ArkAlarmTestServer","Scan",fs)
            expect(JSON.parse(useCount)).toEqual({"ArkAlarmTestServer":{"Scan":1}});
        })
    })
})
