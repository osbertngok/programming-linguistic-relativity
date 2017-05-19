const requestPromise = require('request-promise');
const readFile = require('fs-readfile-promise');

function loadURLFromConfig() {
        return readFile('../data/config.json')
        .then(buf => {
                const config = JSON.parse(buf.toString());
                return config.Urls;
        });
}

function sum(arr){
        return arr.reduce((accumulator, currentValue) => (accumulator + currentValue), 0);
}

function getBodyFromMultipleUrls(urls) {
        return Promise.all(urls
                .map(requestPromise)
                .catch(err => {
                        console.log(err);
                }));
}

function sumUpCharacterCount(strs){
        return sum(strs.map(str => str.length));
}

function printCount(count) {
        console.log(count);
};

async function main() {
        const urls = await loadURLFromConfig();
        const strs = await getBodyFromMultipleUrls(urls);
        const count = sumUpCharacterCount(strs);
        printCount(count);
}

main();
