const { readdir, mkdir, stat, copyFile, unlink } = require('fs/promises');
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

async function copyFiles(source, destination) {
    const files = await readdir(source);

    for (const file of files) {
        const sourceFilePath = path.join(source, file);
        const destinationFilePath = path.join(destination, file);

        await copyFile(sourceFilePath, destinationFilePath);
    }
}

async function clearFolder(folder) {
    const files = await readdir(folder);

    for (const file of files) {
        const filePath = path.join(folder, file);

        await unlink(filePath);
    }
}

async function ensureFolderExists(folder) {
    try {
        await stat(folder);
        await clearFolder(folder);
    } catch {
        await mkdir(folder, { recursive: true });
    }
}

async function copyAndClear() {
    await ensureFolderExists(destinationFolder);
    await copyFiles(sourceFolder, destinationFolder);
}

copyAndClear();
