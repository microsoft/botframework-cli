const path = require("path");
const crossTrain = require("./cross-train");
const luObject = require("../lu/lu");
const luOptions = require("../lu/luOptions");
 
(async () => {​​​​​​
try {​​​​​​
let res=await crossTrain.train('C:\\Users\\shuwan\\GitHub\\botframework-cli\\packages\\luis\\bin\\app', '_interruption', 'C:\\Users\\shuwan\\GitHub\\botframework-cli\\packages\\luis\\bin\\app\\cross-train.config.json');
 
console.log(res);
  }​​​​​​ catch (e) {​​​​​​
console.log(e);
  }​​​​​​
}​​​​​​)();

