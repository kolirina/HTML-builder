const rl = require('readline');
const fs = require('fs');
const path = require('path');

console.log('Hello! Please type something😉');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {flags: 'a'}, 'utf-8');

const readLine = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readLine.on('SIGINT', () => {
    console.log('Have a wonderful day!');
    process.exit();
});

readLine.on('line', (data) => {
    if (data === 'exit') {
        console.log('Have a wonderful day!');
        process.exit();
    }

    writeStream.write(data + '\n');
});