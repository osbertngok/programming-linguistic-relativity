const requestPromise = require('request-promise');
const fs = require('fs');
const readline = require('readline');
const through2 = require('through2');

const loadURLFromConfig = () => {
        const lineReader = readline.createInterface({
                input: fs.createReadStream('../../data/urls.lst')
        })
        const trimStream = through2(function(chunk, enc, callback){
                this.push(chunk.toString().trim())
                callback();
        });
        lineReader.on('line', str => {
                trimStream.write(str);
        });
        lineReader.on('close', str => {
                trimStream.end();
        });
        return trimStream;
}

const getBodyFromMultipleUrls = through2(function(chunk, enc, callback){
        const that = this;
        requestPromise(chunk.toString()).then(function(data){
                that.push(data);
                callback();
        })
});

const sumUpCharacterCount = function(sumUpCallback){
        return through2(function(chunk, enc, callback){
                if (typeof this.sum === 'undefined'){
                        this.sum = 0;
                }
                this.sum += parseInt(chunk.length.toString(), 10);
                callback();
        }, function(){
                sumUpCallback(this.sum);
        });
};


const printCount = count => {
        console.log(count);
}

function main(){
        loadURLFromConfig()
                .pipe(getBodyFromMultipleUrls)
                .pipe(sumUpCharacterCount(printCount));
}

main();
