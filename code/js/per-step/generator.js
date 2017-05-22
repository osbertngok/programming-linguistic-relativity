const co = require('co');
const utils = require("./utils");

function main(){
        co(function*(){
                const urls = yield utils.loadURLFromConfig();
                const strs = yield utils.getBodyFromMultipleUrls(urls);
                const count = utils.sumUpCharacterCount(strs);
                utils.printCount(count);
        });
}

main();
