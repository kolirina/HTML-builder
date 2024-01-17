const { readdir, stat } = require('fs/promises');
const path = require('path');

const BYTES_IN_KB = 1024;

async function getFilesInfo() {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) continue;
        const filePath = path.join(folderPath, file.name);
        const fileExtension = path.extname(file.name);

        const fileStats = await stat(filePath);

        const fileName = path.basename(filePath, fileExtension);
        const trimmedExtension = fileExtension.slice(1);
        const fileSizeInKb = `${Math.round(fileStats.size) / BYTES_IN_KB} kB`;

        const outputInfo = `${fileName} - ${trimmedExtension} - ${fileSizeInKb}`;

        console.log(outputInfo);
    }
}

getFilesInfo();
