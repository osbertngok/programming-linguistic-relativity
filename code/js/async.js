const requestPromise = require('request-promise');
const readFile = require('fs-readfile-promise');

const loadURLFromConfig = () => {
        return readFile('../data/config.json')
        .then(buf => {
                const config = JSON.parse(buf.toString());
                return config.Urls;
        });
}

const sum = arr => arr.reduce((accumulator, currentValue) => (accumulator + currentValue), 0);

const getBodyFromMultipleUrls = urls => Promise.all(urls.map(requestPromise));

const sumUpCharacterCount = strs => sum(strs.map(str => str.length));

const printCount = count => {
        console.log(count);
}

async function main() {
        const urls = await loadURLFromConfig();
        const strs = await getBodyFromMultipleUrls(urls);
        const count = sumUpCharacterCount(strs);
        printCount(count);
}

main();
