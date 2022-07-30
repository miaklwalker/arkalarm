/**
 * @function useCount
 * @description Increments a counter per action per user and saves it to a file called `useCount.json`
 * @param {string} guildName The user's id
 * @param {string} action The user's id
 * @returns {void}
 * @example useCount('ArkAlarmTestServer', 'Scan');
 */
const fs = require('fs');
const PATH = './useCount.json';

function useCountAsync(guildName, action, fileSys=fs) {
  fileSys.readFile(PATH, async (err, data)=>{
      if(err)return;
    let temp = JSON.parse(data);
    if (!temp[guildName]) {
      temp[guildName] = {};
    }
    if (!temp[guildName][action]) {
      temp[guildName][action] = 0;
    }
    temp[guildName][action]++;
    await fileSys.writeFile(PATH, JSON.stringify(temp,null,2), console.log)
  })
}

async function useCount(guildName, action,fileSys=fs) {
  let buffer = fileSys.readFileSync(PATH).toString();
  let temp = JSON.parse(buffer);
  if (!temp[guildName]) {
    temp[guildName] = {};
  }
  if (!temp[guildName][action]) {
    temp[guildName][action] = 0;
  }
  temp[guildName][action]++;
  fileSys.writeFileSync(PATH, JSON.stringify(temp, null, 2));
}
 module.exports = {
    useCount,
    useCountAsync
 }
