const path = require('path');
const { readdir, stat } = require('fs/promises');

async function getFilesInfo() {
    const dirPath = path.join(__dirname, 'secret-folder');
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) continue;

        const filePath = path.join(dirPath, file.name);
        const fileExtension = path.extname(file.name);
        const fileStats = await stat(filePath);

        const fileName = path.basename(filePath, fileExtension);
        const trimmedExtension = fileExtension.slice(1);
        const fileSizeInKb = `${(fileStats.size / 1024).toFixed(2)} kB`;

        const outputInfo = `${fileName} - ${trimmedExtension} - ${fileSizeInKb}`;

        console.log(outputInfo);
    }
}

getFilesInfo();
