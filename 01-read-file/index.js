const fs = require('fs');
const path = require('path');

const info = [];

const sourcePath = path.join(__dirname, 'text.txt');

const readstream = fs.createReadStream(sourcePath, 'utf-8');

readstream.on('data', (chunk) => {
    info.push(chunk);
});

readstream.on('end', () => {
    console.log(info.join(''));
})

