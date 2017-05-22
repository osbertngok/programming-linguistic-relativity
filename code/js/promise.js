const utils = require("./utils");

function main(){
        utils.loadURLFromConfig()
        .then(utils.getBodyFromMultipleUrls)
        .then(utils.sumUpCharacterCount)
        .then(utils.printCount);
}

main();
