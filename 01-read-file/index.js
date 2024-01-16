const fs = require('fs');
const path = require('path');

const info = [];

const readstream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readstream.on('data', (chunk) => {
    info.push(chunk);
});

readstream.on('end', () => {
    console.log(info.join(''));
})

