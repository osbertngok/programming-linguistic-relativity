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
        if (chunk !== null){
                requestPromise(chunk.toString()).then(function(data){
                        that.push(data);
                        callback();
                })
        } else {
                this.push(null);
                callback();
        }

});

const sum = arr => arr.reduce((accumulator, currentValue) => (accumulator + currentValue), 0);

const printCount = count => {
        console.log(count);
}

function main(){
        loadURLFromConfig()
                .pipe(getBodyFromMultipleUrls)
                .pipe(through2(function(chunk, enc, callback){
                        this.push(chunk.length.toString());
                        callback();
                }))
                .pipe(through2(function(chunk, enc, callback){
                        if (typeof this.sum === 'undefined'){
                                this.sum = 0;
                        }
                        this.sum += parseInt(chunk.toString(), 10);
                        callback();
                }, function(){
                        printCount(this.sum);
                }));
}

main();
