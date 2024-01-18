const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');
const fs = require('fs');
const path = require('path');

async function mergeFiles(filePathArr, destinationPath) {
    for (const filePath of filePathArr) {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        const writeStream = fs.createWriteStream(destinationPath, { flags: 'a' }, 'utf-8');

        try {
            await pipeline(readStream, writeStream);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        } finally {
            writeStream.end(); // Close the write stream
        }
    }
}

async function createBundle() {
    try {
        const folderPath = path.join(__dirname, 'styles');
        const files = await readdir(folderPath, { withFileTypes: true });

        const cssFilesPaths = files
            .filter((dirent) => dirent.isFile() && path.extname(dirent.name) === '.css')
            .map((dirent) => path.join(folderPath, dirent.name));

        const destinationPath = path.join(__dirname, 'project-dist', 'bundle.css');

        await mergeFiles(cssFilesPaths, destinationPath);
        console.log('Bundle created successfully.');
    } catch (error) {
        console.error('Error creating bundle:', error);
    }
}

createBundle();