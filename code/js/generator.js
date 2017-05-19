const requestPromise = require('request-promise');
const readFile = require('fs-readfile-promise');
const co = require('co');

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

function main(){
        co(function*(){
                const urls = yield loadURLFromConfig();
                const strs = yield getBodyFromMultipleUrls(urls);
                const count = sumUpCharacterCount(strs);
                printCount(count);
        });
}

main();
