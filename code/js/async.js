const utils = require("./utils");

async function main() {
        const urls = await utils.loadURLFromConfig();
        const strs = await utils.getBodyFromMultipleUrls(urls);
        const count = utils.sumUpCharacterCount(strs);
        utils.printCount(count);
}

main();
