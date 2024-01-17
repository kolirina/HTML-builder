const rl = require('readline');
const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {flags: 'a'}, 'urf-8');

const readLine = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readLine.on('line', (data) => {
    if (data === 'exit') {
        console.log('Have a wonderful day!');
        process.exit();
    }

    writeStream.write(data + '\n');
});

readLine.on('SIGINT', () => {
    
    process.exit();
});

console.log('Hello! Please type something😉');