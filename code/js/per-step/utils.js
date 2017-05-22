const requestPromise = require('request-promise');
const readFile = require('fs-readfile-promise');

const loadURLFromConfig = () => {
        return readFile('../../data/urls.lst')
        .then(buf => {
                return buf.toString().split("\n").filter(str => str);
        });
}

const sum = arr => arr.reduce((accumulator, currentValue) => (accumulator + currentValue), 0);

const getBodyFromMultipleUrls = urls => Promise.all(urls.map(requestPromise));

const sumUpCharacterCount = strs => sum(strs.map(str => str.length));

const printCount = count => {
        console.log(count);
}

module.exports = {
        "loadURLFromConfig": loadURLFromConfig,
        "sum": sum,
        "getBodyFromMultipleUrls": getBodyFromMultipleUrls,
        "sumUpCharacterCount": sumUpCharacterCount,
        "printCount": printCount
}
