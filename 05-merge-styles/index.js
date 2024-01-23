const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');
const fs = require('fs');
const path = require('path');

async function mergeFiles(filePaths, destinationPath) {
    for (const filePath of filePaths) {
        const reader = fs.createReadStream(filePath, 'utf-8');
        const writer = fs.createWriteStream(destinationPath, { flags: 'a' }, 'utf-8');

        try {
            await pipeline(reader, writer);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        } finally {
            writer.end();
        }
    }
}

async function bundleStyles() {
    try {
        const stylesFolder = path.join(__dirname, 'styles');
        const files = await readdir(stylesFolder, { withFileTypes: true });

        const cssFilePaths = files
            .filter((file) => file.isFile() && path.extname(file.name) === '.css')
            .map((file) => path.join(stylesFolder, file.name));

        const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
        const writer = fs.createWriteStream(bundlePath, { flags: 'w' }, 'utf-8');
        await mergeFiles(cssFilePaths, bundlePath);
        console.log('Bundle created successfully.');
    } catch (error) {
        console.error('Error creating bundle:', error);
    }
}

bundleStyles();