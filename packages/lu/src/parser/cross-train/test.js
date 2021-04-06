const path = require("path");
const crossTrain = require("./cross-train");
const luObject = require("../lu/lu");
const luOptions = require("../lu/luOptions");
 
(async () => {
  try {
    let res = await crossTrain.train('application', '_interrunption', 'application/cross-train.config.json', true, {} );
 
    console.log(res);
  } catch (e) {
    console.log(e);
  }
})();